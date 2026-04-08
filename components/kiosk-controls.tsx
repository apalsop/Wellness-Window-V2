"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, SkipForward, Timer, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const INTERVAL_OPTIONS = [
  { value: 10, label: "10m" },
  { value: 15, label: "15m" },
  { value: 30, label: "30m" },
  { value: 60, label: "60m" },
]

interface KioskControlsProps {
  isActive: boolean
  onToggle: () => void
  onSkip: () => void
  intervalMinutes: number
  onIntervalChange: (minutes: number) => void
  timeUntilNext: number // seconds remaining
  className?: string
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function KioskControls({ 
  isActive, 
  onToggle, 
  onSkip, 
  intervalMinutes,
  onIntervalChange,
  timeUntilNext,
  className 
}: KioskControlsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleIntervalSelect = (minutes: number) => {
    onIntervalChange(minutes)
    setDropdownOpen(false)
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        onClick={onToggle}
        className={cn(
          "audio-btn flex items-center gap-2",
          isActive && "active"
        )}
        aria-label={isActive ? "Stop kiosk mode" : "Start kiosk mode"}
      >
        {isActive ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">Kiosk Mode</span>
      </button>

      {isActive && (
        <>
          {/* Interval Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="audio-btn flex items-center gap-1 px-2"
              aria-label="Change interval"
            >
              <span className="text-xs font-medium">{intervalMinutes}m</span>
              <ChevronDown className={cn(
                "h-3 w-3 transition-transform",
                dropdownOpen && "rotate-180"
              )} />
            </button>
            
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 min-w-[60px]">
                {INTERVAL_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleIntervalSelect(option.value)}
                    className={cn(
                      "w-full px-3 py-1.5 text-xs text-left hover:bg-muted transition-colors",
                      option.value === intervalMinutes && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-2 bg-muted/50 rounded-md py-1">
            <Timer className="h-3.5 w-3.5" />
            <span className="font-mono min-w-[36px]">{formatTime(timeUntilNext)}</span>
          </div>

          {/* Skip Button */}
          <button
            onClick={onSkip}
            className="audio-btn flex items-center gap-2 px-3"
            aria-label="Skip to next window"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  )
}
