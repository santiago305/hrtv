import {
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type PopoverPlacement =
  | "bottom-start"
  | "bottom-end"
  | "top-start"
  | "top-end"
  | "right-start"
  | "left-start";

type PopoverAnimation = "scale" | "slide";

type PopoverProps = {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  children: ReactNode;

  title?: string;
  description?: string;
  footer?: ReactNode;

  placement?: PopoverPlacement;
  offset?: number;

  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  preventClose?: boolean;
  hideHeader?: boolean;
  showCloseButton?: boolean;

  initialFocusRef?: RefObject<HTMLElement | null>;
  animation?: PopoverAnimation;

  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  closeButtonClassName?: string;
};

export function Popover({
  open,
  onClose,
  anchorRef,
  children,
  title,
  description,
  footer,
  placement = "bottom-start",
  offset = 8,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  preventClose = false,
  hideHeader = false,
  showCloseButton = false,
  initialFocusRef,
  animation = "scale",
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
  titleClassName,
  descriptionClassName,
  closeButtonClassName,
}: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const canClose = !preventClose;
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const anchor = anchorRef.current;
      const popover = popoverRef.current;
      if (!anchor || !popover) return;

      const rect = anchor.getBoundingClientRect();
      const popRect = popover.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (placement) {
        case "bottom-start":
          top = rect.bottom + offset;
          left = rect.left;
          break;
        case "bottom-end":
          top = rect.bottom + offset;
          left = rect.right - popRect.width;
          break;
        case "top-start":
          top = rect.top - popRect.height - offset;
          left = rect.left;
          break;
        case "top-end":
          top = rect.top - popRect.height - offset;
          left = rect.right - popRect.width;
          break;
        case "right-start":
          top = rect.top;
          left = rect.right + offset;
          break;
        case "left-start":
          top = rect.top;
          left = rect.left - popRect.width - offset;
          break;
      }

      const padding = 8;
      const maxLeft = window.innerWidth - popRect.width - padding;
      const maxTop = window.innerHeight - popRect.height - padding;

      setPosition({
        top: Math.max(padding, Math.min(top, maxTop)),
        left: Math.max(padding, Math.min(left, maxLeft)),
      });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape && canClose) {
        onClose();
      }
    };

    const handlePointerDown = (event: MouseEvent) => {
      if (!closeOnOutsideClick || !canClose) return;

      const target = event.target as Node;
      const popover = popoverRef.current;
      const anchor = anchorRef.current;

      const clickedInsidePopover = popover?.contains(target);
      const clickedAnchor = anchor?.contains(target);

      if (!clickedInsidePopover && !clickedAnchor) {
        onClose();
      }
    };

    updatePosition();
    requestAnimationFrame(updatePosition);

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);

    if (initialFocusRef?.current) {
      requestAnimationFrame(() => {
        initialFocusRef.current?.focus();
      });
    }

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [
    open,
    anchorRef,
    placement,
    offset,
    closeOnEscape,
    closeOnOutsideClick,
    canClose,
    onClose,
    initialFocusRef,
  ]);

  const animationProps =
    animation === "slide"
      ? {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 8 },
        }
      : {
          initial: { opacity: 0, scale: 0.98 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.98 },
        };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={popoverRef}
          role="dialog"
          aria-modal="false"
          className={cn(
            "fixed z-50 flex max-h-[calc(100vh-1rem)] w-auto min-w-55 max-w-[calc(100vw-1rem)] flex-col overflow-hidden",
            "rounded-2xl border border-zinc-200/80 bg-white",
            "shadow-[0_16px_40px_-16px_rgba(0,0,0,0.22)]",
            className
          )}
          style={{
            top: position.top,
            left: position.left,
          }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          {...animationProps}
        >
          {!hideHeader && (title || description || showCloseButton) && (
            <div
              className={cn(
                "flex items-start justify-between gap-3 border-b border-zinc-100 bg-zinc-50/70 px-4 py-3",
                headerClassName
              )}
            >
              <div className="min-w-0">
                {title && (
                  <h3
                    className={cn(
                      "text-sm font-semibold tracking-tight text-zinc-900",
                      titleClassName
                    )}
                  >
                    {title}
                  </h3>
                )}

                {description && (
                  <p
                    className={cn(
                      "mt-1 text-xs leading-5 text-zinc-500",
                      descriptionClassName
                    )}
                  >
                    {description}
                  </p>
                )}
              </div>

              {showCloseButton && canClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900",
                    closeButtonClassName
                  )}
                  aria-label="Cerrar popover"
                >
                  ×
                </button>
              )}
            </div>
          )}

          <div className={cn("scroll-y-stable px-4 py-4", bodyClassName)}>{children}</div>

          {footer && (
            <div
              className={cn(
                "border-t border-zinc-100 bg-zinc-50/60 px-4 py-3",
                footerClassName
              )}
            >
              {footer}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
