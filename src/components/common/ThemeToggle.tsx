import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function ThemeToggle({
  className = "",
  showLabel = false,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const { resolvedTheme, toggleTheme } = useTheme();

  const handleToggle = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(8);
      } catch {
        // safe fallback
      }
    }
    toggleTheme();
  };

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Activer le mode clair" : "Activer le mode sombre";

  return (
    <button
      type="button"
      className={`theme-toggle-btn ${className}`}
      onClick={handleToggle}
      aria-label={label}
      title={label}
    >
      <span className="theme-toggle-icon-wrap" aria-hidden="true">
        {isDark ? (
          <Sun size={17} className="theme-icon sun-icon" />
        ) : (
          <Moon size={17} className="theme-icon moon-icon" />
        )}
      </span>
      {showLabel && (
        <span className="theme-toggle-label">
          {isDark ? "Clair" : "Sombre"}
        </span>
      )}
    </button>
  );
}
