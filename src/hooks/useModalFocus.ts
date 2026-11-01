import { useEffect, useRef } from "react";

const modalStack: HTMLDivElement[] = [];
let bodyOverflow = "";

export function useModalFocus(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    if (modalStack.length === 0) bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const node = ref.current;
    if (node) modalStack.push(node);
    const elements = () =>
      Array.from(
        node?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), a[href], textarea, select:not(:disabled), [tabindex="0"]',
        ) || [],
      ).filter((el) => el.getClientRects().length > 0);
    elements()[0]?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (modalStack[modalStack.length - 1] !== node) return;
      if (event.key === "Escape") {
        event.preventDefault();
        close.current();
      }
      if (event.key !== "Tab") return;
      const items = elements(),
        first = items[0],
        last = items[items.length - 1];
      if (!node?.contains(document.activeElement)) {
        event.preventDefault();
        first?.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      const index = node ? modalStack.indexOf(node) : -1;
      if (index >= 0) modalStack.splice(index, 1);
      if (modalStack.length === 0) document.body.style.overflow = bodyOverflow;
      const top = modalStack[modalStack.length - 1];
      if (previous?.isConnected && (!top || top.contains(previous)))
        previous.focus();
    };
  }, [open]);
  return ref;
}
