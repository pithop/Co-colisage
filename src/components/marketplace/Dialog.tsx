import { ReactNode, useId, useRef } from "react";
import { X } from "lucide-react";
import { useModalFocus } from "../../hooks/useModalFocus";

export function Dialog({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useModalFocus(true, onClose);
  const id = useId();
  const dragStartY = useRef<number | null>(null);
  const dragStartTime = useRef<number>(0);
  const currentDragY = useRef<number>(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only initiate sheet drag on mobile/touch pointers or on drag handle
    if (e.button !== 0) return;
    dragStartY.current = e.clientY;
    dragStartTime.current = performance.now();
    currentDragY.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartY.current === null || !ref.current) return;
    const deltaY = e.clientY - dragStartY.current;
    if (deltaY > 0) {
      currentDragY.current = deltaY;
      ref.current.style.transform = `translateY(${deltaY}px)`;
      ref.current.style.transition = "none";
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartY.current === null || !ref.current) return;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
    const elapsed = performance.now() - dragStartTime.current;
    const velocity = elapsed > 0 ? currentDragY.current / elapsed : 0;
    const shouldDismiss = currentDragY.current > 75 || velocity > 0.4;

    dragStartY.current = null;

    if (shouldDismiss) {
      ref.current.style.transition = "transform 180ms cubic-bezier(0.25, 1, 0.5, 1)";
      ref.current.style.transform = "translateY(100%)";
      setTimeout(onClose, 160);
    } else {
      ref.current.style.transition = "transform 240ms cubic-bezier(0.16, 1, 0.3, 1)";
      ref.current.style.transform = "";
    }
  };

  return (
    <div
      className="market-dialog-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        className={`market-dialog ${wide ? "wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
      >
        <div
          className="sheet-drag-handle"
          aria-hidden="true"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
        <header>
          <h2 id={id}>{title}</h2>
          <button className="icon-button" aria-label="Fermer" onClick={onClose}>
            <X size={22} />
          </button>
        </header>
        <div className="market-dialog-content">{children}</div>
      </div>
    </div>
  );
}
