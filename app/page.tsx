"use client"

import { useState, useEffect, useCallback } from "react"
import { AudioMixer } from "@/components/audio-mixer"
import { WindowsGrid, liveStreamWindows } from "@/components/windows-grid"
import { StatusBadge } from "@/components/status-badge"
import { KioskControls } from "@/components/kiosk-controls"
import { useGoldenHour, getModeThemeClass } from "@/hooks/use-golden-hour"
import { cn } from "@/lib/utils"

const DEFAULT_INTERVAL_MINUTES = 10

export default function Home() {
  const timeMode = useGoldenHour()
  const [kioskMode, setKioskMode] = useState(false)
  const [kioskIndex, setKioskIndex] = useState(0)
  const [intervalMinutes, setIntervalMinutes] = useState(DEFAULT_INTERVAL_MINUTES)
  const [timeUntilNext, setTimeUntilNext] = useState(DEFAULT_INTERVAL_MINUTES * 60)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Kiosk mode auto-cycling with countdown
  useEffect(() => {
    if (!kioskMode) return

    // Reset countdown when interval changes or kiosk starts
    setTimeUntilNext(intervalMinutes * 60)

    const countdownInterval = setInterval(() => {
      setTimeUntilNext((prev) => {
        if (prev <= 1) {
          // Time's up, move to next window
          setKioskIndex((idx) => (idx + 1) % liveStreamWindows.length)
          return intervalMinutes * 60 // Reset timer
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdownInterval)
  }, [kioskMode, intervalMinutes])

  const handleKioskToggle = useCallback(() => {
    setKioskMode((prev) => !prev)
    if (!kioskMode) {
      setKioskIndex(0)
      setTimeUntilNext(intervalMinutes * 60)
    }
  }, [kioskMode, intervalMinutes])

  const handleKioskSkip = useCallback(() => {
    setKioskIndex((prev) => (prev + 1) % liveStreamWindows.length)
    setTimeUntilNext(intervalMinutes * 60) // Reset timer on manual skip
  }, [intervalMinutes])

  const handleIntervalChange = useCallback((minutes: number) => {
    setIntervalMinutes(minutes)
    setTimeUntilNext(minutes * 60) // Reset countdown with new interval
  }, [])

  const handleWindowSelect = useCallback(() => {
    // When manually selecting a window, exit kiosk mode
    if (kioskMode) {
      setKioskMode(false)
    }
  }, [kioskMode])

  // Show a loading state until client-side hydration is complete
  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground text-lg">Loading Wellness Window...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      getModeThemeClass(timeMode)
    )}>
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              WELLNESS WINDOW
            </h1>

            {/* Right side controls */}
            <div className="flex items-center gap-3">
              {/* Kiosk Controls */}
              <KioskControls
                isActive={kioskMode}
                onToggle={handleKioskToggle}
                onSkip={handleKioskSkip}
                intervalMinutes={intervalMinutes}
                onIntervalChange={handleIntervalChange}
                timeUntilNext={timeUntilNext}
              />

              {/* Status Badge */}
              <StatusBadge />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Audio Dashboard */}
        <AudioMixer />

        {/* Windows Section */}
        <WindowsGrid
          kioskMode={kioskMode}
          currentKioskIndex={kioskIndex}
          onWindowSelect={handleWindowSelect}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-muted-foreground font-medium">
            ARK - AZ
          </p>
        </div>
      </footer>
    </div>
  )
}
