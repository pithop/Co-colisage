import { ReactNode, useId } from "react";
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
