"use client"

import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  className?: string
}

export function StatusBadge({ className }: StatusBadgeProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-full",
      "glass-subtle text-xs font-mono tracking-wider",
      className
    )}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 status-pulse" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
      </span>
      <span className="text-muted-foreground">
        ARK-AZ <span className="text-primary/80">//</span> STABLE
      </span>
    </div>
  )
}
