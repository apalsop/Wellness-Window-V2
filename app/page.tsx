"use client"

import { useState, useEffect, useCallback } from "react"
import { AudioMixer } from "@/components/audio-mixer"
import { WindowsGrid, windows } from "@/components/windows-grid"
import { StatusBadge } from "@/components/status-badge"
import { KioskControls } from "@/components/kiosk-controls"
import { useGoldenHour, getModeThemeClass, getModeLabel } from "@/hooks/use-golden-hour"
import { cn } from "@/lib/utils"
import { Sun, Sunset, Moon } from "lucide-react"

const KIOSK_INTERVAL_MINUTES = 10

export default function Home() {
  const timeMode = useGoldenHour()
  const [kioskMode, setKioskMode] = useState(false)
  const [kioskIndex, setKioskIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Kiosk mode auto-cycling
  useEffect(() => {
    if (!kioskMode) return

    const interval = setInterval(() => {
      setKioskIndex((prev) => (prev + 1) % windows.length)
    }, KIOSK_INTERVAL_MINUTES * 60 * 1000)

    return () => clearInterval(interval)
  }, [kioskMode])

  const handleKioskToggle = useCallback(() => {
    setKioskMode((prev) => !prev)
    if (!kioskMode) {
      setKioskIndex(0)
    }
  }, [kioskMode])

  const handleKioskSkip = useCallback(() => {
    setKioskIndex((prev) => (prev + 1) % windows.length)
  }, [])

  const handleWindowSelect = useCallback(() => {
    // When manually selecting a window, exit kiosk mode
    if (kioskMode) {
      setKioskMode(false)
    }
  }, [kioskMode])

  const TimeModeIcon = timeMode === "focus" ? Sun : timeMode === "winddown" ? Sunset : Moon

  // Show a loading state until client-side hydration is complete
  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-foreground/50 text-lg">Loading Wellness Window...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "min-h-screen flex flex-col transition-colors duration-1000 bg-background",
      getModeThemeClass(timeMode)
    )}>
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                THE WELLNESS WINDOW
              </h1>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-3">
              {/* Time Mode Indicator */}
              <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground px-3 py-1.5 glass-subtle rounded-full">
                <TimeModeIcon className="h-3.5 w-3.5 text-primary" />
                <span>{getModeLabel(timeMode)}</span>
              </div>

              {/* Kiosk Controls */}
              <KioskControls
                isActive={kioskMode}
                onToggle={handleKioskToggle}
                onSkip={handleKioskSkip}
                intervalMinutes={KIOSK_INTERVAL_MINUTES}
              />

              {/* Status Badge */}
              <StatusBadge className="hidden sm:flex" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Audio Dashboard */}
        <AudioMixer />

        {/* Windows Section */}
        <section className="flex-1">
          <WindowsGrid
            kioskMode={kioskMode}
            currentKioskIndex={kioskIndex}
            onWindowSelect={handleWindowSelect}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="glass border-t border-border/50 py-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            A digital sanctuary for focus, relaxation, and serenity
          </p>
          <p className="text-sm font-medium tracking-wider text-foreground/60">
            ARK <span className="text-primary">-</span> AZ
          </p>
        </div>
      </footer>

      {/* Mobile Status Badge */}
      <div className="fixed bottom-20 right-4 sm:hidden">
        <StatusBadge />
      </div>
    </div>
  )
}
