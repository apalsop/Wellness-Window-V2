"use client"

import { useState, useEffect } from "react"

export type TimeMode = "focus" | "winddown" | "rest"

export function useGoldenHour(): TimeMode {
  const [mode, setMode] = useState<TimeMode>("focus")

  useEffect(() => {
    const updateMode = () => {
      const hour = new Date().getHours()
      
      if (hour >= 9 && hour < 17) {
        // 9am - 5pm: Focus mode (Teal)
        setMode("focus")
      } else if (hour >= 17 && hour < 20) {
        // 5pm - 8pm: Wind-down mode (Sunset Orange)
        setMode("winddown")
      } else {
        // 8pm - 9am: Rest mode (Midnight Indigo)
        setMode("rest")
      }
    }

    // Initial update
    updateMode()

    // Update every minute
    const interval = setInterval(updateMode, 60000)

    return () => clearInterval(interval)
  }, [])

  return mode
}

export function getModeLabel(mode: TimeMode): string {
  switch (mode) {
    case "focus":
      return "Focus Mode"
    case "winddown":
      return "Wind-down Mode"
    case "rest":
      return "Rest Mode"
  }
}

export function getModeThemeClass(mode: TimeMode): string {
  switch (mode) {
    case "focus":
      return "" // Default theme
    case "winddown":
      return "theme-winddown"
    case "rest":
      return "theme-rest"
  }
}
