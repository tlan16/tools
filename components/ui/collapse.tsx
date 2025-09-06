import * as React from "react";
import { cn } from "@/lib/utils";

export function Collapse({
  open,
  onOpenChange,
  title,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="text-base font-medium">{title}</div>
        <button
          aria-expanded={open}
          onClick={() => onOpenChange(!open)}
          className="text-sm underline"
        >
          {open ? "Hide" : "Show"}
        </button>
      </div>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
}

export default Collapse;

