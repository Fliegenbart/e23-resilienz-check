import type { Assessment } from "../domain/types";
import { parseImport, serialize } from "../import-export/exchange";
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("ki-resilienz-check", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("workspace");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () =>
      reject(req.error ?? Error("Lokale Datenbank nicht verfügbar."));
    req.onblocked = () =>
      reject(Error("Bitte andere geöffnete Instanzen schließen."));
  });
}
export async function loadWorkspace(): Promise<Assessment[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("workspace", "readonly");
    const req = tx.objectStore("workspace").get("assessments");
    let data: unknown;
    req.onsuccess = () => (data = req.result);
    tx.oncomplete = () => {
      db.close();
      try {
        resolve(
          data === undefined ? [] : parseImport(String(data)).assessments,
        );
      } catch (e) {
        reject(e);
      }
    };
    tx.onerror = tx.onabort = () => {
      db.close();
      reject(tx.error);
    };
  });
}
let queue: Promise<void> = Promise.resolve();
export function saveWorkspace(assessments: Assessment[]): Promise<void> {
  const text = serialize(assessments);
  const work = async () => {
    parseImport(text);
    const db = await openDatabase();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction("workspace", "readwrite");
      try {
        tx.objectStore("workspace").put(text, "assessments");
      } catch (error) {
        tx.abort();
        db.close();
        reject(error);
        return;
      }
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = tx.onabort = () => {
        db.close();
        reject(tx.error ?? Error("Speichern abgebrochen."));
      };
    });
  };
  const current = queue.then(work, work);
  queue = current.catch(() => {});
  return current;
}
