import * as React from "react";
import { useEffect, useState } from "react";
import { CheckCircle, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertProps {
  variant?: "success" | "error";
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  duration?: number;
  className?: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = "success",
      title,
      children,
      onClose,
      className,
      duration = 3000,
      ...props
    },
    ref
  ) => {
    const Icon = variant === "success" ? CheckCircle : AlertTriangle;
    const [isShowing, setIsShowing] = useState(true);
    const handleClose = React.useCallback(() => {
      setIsShowing(false);

      setTimeout(() => {
        onClose?.();
      }, 300);
    }, [onClose]);

    useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(handleClose, duration);
        return () => clearTimeout(timer);
      }
    }, [duration, handleClose]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex items-start gap-3 p-4 rounded-xl shadow-lg transition-opacity duration-300",
          variant === "success"
            ? "bg-gradient-to-r from-emerald-500 to-cyan-500"
            : "bg-gradient-to-r from-red-500 to-orange-500",
          "text-white",
          isShowing ? "opacity-100" : "opacity-0",
          className
        )}
        {...props}
      >
        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          {title && <h4 className="font-medium text-sm mb-1">{title}</h4>}
          <div className="text-sm text-white/90">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-md hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
            aria-label="Close alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = "Alert";

export { Alert };
