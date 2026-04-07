"use client"

import { Play, Pause, SkipForward, Timer } from "lucide-react"
import { cn } from "@/lib/utils"

interface KioskControlsProps {
  isActive: boolean
  onToggle: () => void
  onSkip: () => void
  intervalMinutes: number
  className?: string
}

export function KioskControls({ 
  isActive, 
  onToggle, 
  onSkip, 
  intervalMinutes,
  className 
}: KioskControlsProps) {
  return (
    <div className={cn(
      "flex items-center gap-2",
      className
    )}>
      <button
        onClick={onToggle}
        className={cn(
          "glass-subtle flex items-center gap-2 px-4 py-2 rounded-xl",
          "text-sm font-medium tracking-wide",
          "transition-all duration-300 ease-out",
          "hover:scale-105 active:scale-95",
          "focus:outline-none focus:ring-2 focus:ring-primary/50",
          isActive
            ? "bg-primary/20 text-primary border-primary/50"
            : "text-foreground/80 hover:text-foreground hover:bg-secondary/50"
        )}
        aria-label={isActive ? "Stop kiosk mode" : "Start kiosk mode"}
      >
        {isActive ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">Kiosk</span>
      </button>

      {isActive && (
        <>
          <button
            onClick={onSkip}
            className={cn(
              "glass-subtle flex items-center gap-2 px-3 py-2 rounded-xl",
              "text-sm font-medium",
              "transition-all duration-300 ease-out",
              "hover:scale-105 active:scale-95",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              "text-foreground/80 hover:text-foreground hover:bg-secondary/50"
            )}
            aria-label="Skip to next window"
          >
            <SkipForward className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-2">
            <Timer className="h-3.5 w-3.5" />
            <span>{intervalMinutes}m</span>
          </div>
        </>
      )}
    </div>
  )
}
