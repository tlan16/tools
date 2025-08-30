import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 motion-standard disabled:pointer-events-none disabled:opacity-38 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring overflow-hidden state-layer-hover",
  {
    variants: {
      variant: {
        // Material Design Filled Button (Primary)
        default:
          "bg-primary text-primary-foreground rounded-full h-10 px-6 elevation-1 hover:elevation-2 active:elevation-1",
        // Material Design Filled Tonal Button
        secondary:
          "bg-secondary text-secondary-foreground rounded-full h-10 px-6 elevation-1 hover:elevation-2 active:elevation-1",
        // Material Design Outlined Button
        outline:
          "border border-primary text-primary bg-transparent rounded-full h-10 px-6 hover:bg-primary/8 active:bg-primary/16",
        // Material Design Text Button
        ghost:
          "text-primary bg-transparent rounded-full h-10 px-6 hover:bg-primary/8 active:bg-primary/16",
        // Material Design Elevated Button
        elevated:
          "bg-card text-card-foreground rounded-full h-10 px-6 elevation-1 hover:elevation-2 active:elevation-1 hover:bg-primary/8",
        // Material Design Danger/Error Button
        destructive:
          "bg-destructive text-destructive-foreground rounded-full h-10 px-6 elevation-1 hover:elevation-2 active:elevation-1",
        // Material Design Link Style
        link: "text-primary underline-offset-4 hover:underline h-auto p-0 bg-transparent",
      },
      size: {
        // Material Design Standard Button Height
        default: "h-10 px-6",
        // Material Design Small Button
        sm: "h-8 px-4 text-xs rounded-full",
        // Material Design Large Button
        lg: "h-12 px-8 text-base rounded-full",
        // Material Design Icon Button
        icon: "size-10 rounded-full p-0 min-w-10",
        // Material Design Small Icon Button
        "icon-sm": "size-8 rounded-full p-0 min-w-8",
        // Material Design Large Icon Button
        "icon-lg": "size-12 rounded-full p-0 min-w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Comp>
  )
}

export { Button, buttonVariants }
