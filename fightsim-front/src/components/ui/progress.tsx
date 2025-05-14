import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  variant?: "health" | "default"
  maxValue?: number
}

function Progress({
  className,
  value,
  variant = "default",
  ...props
}: ProgressProps) {
  // Calculate percent based on variant
  const percent =
    variant === "health"
      ? (((value ?? 0) / 200) * 100)
      : (value ?? 0)

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        //className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "bg-primary h-full w-full flex-1 transition-all",
          className
        )}
        style={{ transform: `translateX(-${100 - (percent || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
