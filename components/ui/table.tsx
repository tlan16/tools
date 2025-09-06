import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <table
      className={cn("w-full caption-top text-sm border-collapse", className)}
      {...props}
    />
  );
}

export function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead className={cn("[&_tr]:border-b", className)} {...props} />
  );
}

export function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  );
}

export function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return <tr className={cn("border-b", className)} {...props} />;
}

export function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      className={cn("h-12 px-3 text-left align-middle font-medium text-muted-foreground bg-gray-100", className)}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return <td className={cn("px-3 py-2 align-middle", className)} {...props} />;
}

export function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
  return <caption className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export default Table;

