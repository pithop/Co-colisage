import React, { useEffect, useRef, useState, useCallback } from "react";
import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxHeight?: string; // Default '90vh'
  showCloseButton?: boolean;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxHeight = "90vh",
  showCloseButton = true,
}: BottomSheetProps) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [viewportBottomOffset, setViewportBottomOffset] = useState(0);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Handle iOS Virtual Keyboard using window.visualViewport
  useEffect(() => {
    if (!isOpen || typeof window === "undefined" || !window.visualViewport) return;

    const handleViewportChange = () => {
      const vv = window.visualViewport;
      if (!vv) return;
      const offset = window.innerHeight - (vv.height + vv.offsetTop);
      setViewportBottomOffset(Math.max(0, offset));
    };

    window.visualViewport.addEventListener("resize", handleViewportChange);
    window.visualViewport.addEventListener("scroll", handleViewportChange);
    return () => {
      window.visualViewport?.removeEventListener("resize", handleViewportChange);
      window.visualViewport?.removeEventListener("scroll", handleViewportChange);
    };
  }, [isOpen]);

  // Haptic feedback trigger
  const triggerHaptic = useCallback((ms = 8) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // Safe fallback
      }
    }
  }, []);

  // Touch Drag Handling for Pull-Down-to-Dismiss (Apple HIG)
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only allow drag-to-dismiss if scrolled at the very top of content
    if (contentRef.current && contentRef.current.scrollTop > 5) return;
    startYRef.current = e.touches[0].clientY;
    currentYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    currentYRef.current = e.touches[0].clientY;
    const deltaY = currentYRef.current - startYRef.current;
    if (deltaY > 0) {
      // Pulling down (resistance formula)
      setDragOffset(deltaY * 0.75);
    } else {
      // Trying to pull up beyond max: apply rubber band effect
      setDragOffset(deltaY * 0.2);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const deltaY = currentYRef.current - startYRef.current;
    // Dismiss threshold: 100px
    if (deltaY > 100) {
      triggerHaptic(12);
      onClose();
    }
    setDragOffset(0);
  };

  if (!isOpen) return null;

  return (
    <div
      className="bv-sheet-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          triggerHaptic(6);
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title || "Fenêtre d'action"}
    >
      <div
        ref={sheetRef}
        className={`bv-sheet-container ${isDragging ? "dragging" : ""}`}
        style={{
          maxHeight,
          transform: `translateY(${Math.max(0, dragOffset)}px)`,
          bottom: `${viewportBottomOffset}px`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Apple HIG Drag Handle Bar */}
        <div className="bv-sheet-handle-zone">
          <div className="bv-sheet-drag-handle" aria-hidden="true" />
        </div>

        {/* Header */}
        {(title || showCloseButton) && (
          <div className="bv-sheet-header">
            <div className="bv-sheet-title-group">
              {title && <h2 className="bv-sheet-title">{title}</h2>}
              {subtitle && <p className="bv-sheet-subtitle">{subtitle}</p>}
            </div>
            {showCloseButton && (
              <button
                type="button"
                className="bv-sheet-close-btn"
                aria-label="Fermer"
                onClick={() => {
                  triggerHaptic(6);
                  onClose();
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Scrollable Content */}
        <div ref={contentRef} className="bv-sheet-content">
          {children}
        </div>
      </div>
    </div>
  );
}
