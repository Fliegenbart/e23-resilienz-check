import { parseChecks, serializeChecks } from "./model";
import type { QuickCheck } from "./model";
function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    let blocked = false;
    const req = indexedDB.open("e23-quick-check", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("workspace");
    req.onsuccess = () => {
      if (blocked) req.result.close();
      else resolve(req.result);
    };
    req.onerror = () =>
      reject(req.error ?? Error("Der lokale Speicher ist nicht verfügbar."));
    req.onblocked = () => {
      blocked = true;
      reject(
        Error("Der lokale Speicher ist durch ein anderes Fenster blockiert."),
      );
    };
  });
}
export async function loadChecks(): Promise<QuickCheck[]> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("workspace", "readonly");
    const req = tx.objectStore("workspace").get("checks");
    tx.oncomplete = () => {
      db.close();
      try {
        resolve(
          req.result === undefined
            ? []
            : parseChecks(String(req.result), Infinity),
        );
      } catch (error) {
        reject(error);
      }
    };
    tx.onerror = tx.onabort = () => {
      db.close();
      reject(
        tx.error ?? Error("Der lokale Speicher konnte nicht gelesen werden."),
      );
    };
  });
}
let queue: Promise<void> = Promise.resolve();
export function saveChecks(checks: QuickCheck[]) {
  const text = serializeChecks(checks);
  const work = async () => {
    parseChecks(text, Infinity);
    const db = await database();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction("workspace", "readwrite");
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = tx.onabort = () => {
        db.close();
        reject(tx.error ?? Error("Speichern abgebrochen."));
      };
      try {
        tx.objectStore("workspace").put(text, "checks");
      } catch (error) {
        tx.abort();
        db.close();
        reject(error);
      }
    });
  };
  const current = queue.then(work, work);
  queue = current.catch(() => {});
  return current;
}
