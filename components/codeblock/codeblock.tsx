import React, {ComponentProps, forwardRef} from "react";
import ShikiHighlighter from "react-shiki";
import {highlighter} from "@/components/codeblock/highligher";


type Props = ComponentProps<typeof ShikiHighlighter>;

export const Codeblock = forwardRef<HTMLDivElement, Props>(({children, ...props}, ref) => {
  return (
    <ShikiHighlighter ref={ref} highlighter={highlighter} {...props}>
      {children}
    </ShikiHighlighter>
  )
})

Codeblock.displayName = "Codeblock"
