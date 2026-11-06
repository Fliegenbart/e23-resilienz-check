import { useSyncExternalStore } from "react";
export function Arrow({
  direction = "right",
}: {
  direction?: "left" | "right";
}) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={direction === "left" ? { transform: "rotate(180deg)" } : undefined}
    >
      <path
        d="M4 12h15M13 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  );
}
export function Close() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="m6 6 12 12M6 18 18 6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
const query = "(prefers-reduced-motion: reduce)";
const subscribe = (fn: () => void) => {
  const m = window.matchMedia(query);
  m.addEventListener("change", fn);
  return () => m.removeEventListener("change", fn);
};
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => true,
  );
}
