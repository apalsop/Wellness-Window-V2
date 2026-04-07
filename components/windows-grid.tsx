"use client"

import { useState, useCallback } from "react"
import { VideoPlayer } from "./video-player"
import { cn } from "@/lib/utils"
import { Shuffle } from "lucide-react"

export interface WindowItem {
  id: string
  title: string
  videoId: string
}

const windows: WindowItem[] = [
  { id: "jackson-hole", title: "Jackson Hole", videoId: "1G2bKrh7CKw" },
  { id: "venice-guglie", title: "Venice: Guglie", videoId: "ydYDqZQpim8" },
  { id: "venice-marks", title: "Venice: St. Marks", videoId: "c0JVQLN4EqI" },
  { id: "shibuya", title: "Shibuya Crossing", videoId: "3n6Rre3l5jE" },
  { id: "yellowstone", title: "Yellowstone", videoId: "6B4ZPl0LCVM" },
  { id: "aurora", title: "Aurora Borealis", videoId: "WHTFuRdWYPM" },
  { id: "iss", title: "Earth & Space ISS", videoId: "P9C25Un7xaM" },
  { id: "namibia", title: "Namibia", videoId: "ydYDqZQpim8" },
  { id: "anacapa", title: "Anacapa Island", videoId: "OmkGFrBQQaE" },
  { id: "reef", title: "Underwater Reef", videoId: "r9LIasj1P_Q" },
  { id: "kenya-safari", title: "Kenya Safari", videoId: "IUfzqSVSYbA" },
  { id: "kenya-waterhole", title: "Kenya Waterhole", videoId: "FxL4pWtCIqE" },
  { id: "city-drive", title: "City Drive & Radio", videoId: "5qap5aO4i9A" },
  { id: "walking", title: "Walking Tour", videoId: "8ybW48rKBME" },
  { id: "flyover", title: "Airplane Flyover", videoId: "qVrMd3DjzVA" },
]

interface WindowsGridProps {
  kioskMode: boolean
  currentKioskIndex: number
  onWindowSelect: (window: WindowItem | null) => void
}

export function WindowsGrid({ kioskMode, currentKioskIndex, onWindowSelect }: WindowsGridProps) {
  const [selectedWindow, setSelectedWindow] = useState<WindowItem | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleWindowClick = useCallback((window: WindowItem) => {
    setSelectedWindow(window)
    onWindowSelect(window)
  }, [onWindowSelect])

  const handleClose = useCallback(() => {
    setSelectedWindow(null)
    setIsFullscreen(false)
    onWindowSelect(null)
  }, [onWindowSelect])

  const handleRandomWindow = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * windows.length)
    handleWindowClick(windows[randomIndex])
  }, [handleWindowClick])

  // In kiosk mode, auto-select the current window
  const activeWindow = kioskMode ? windows[currentKioskIndex] : selectedWindow

  return (
    <div className="flex flex-col gap-6">
      {/* Instructions */}
      {!activeWindow && (
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <p className="text-muted-foreground">
            Select a Window
          </p>
          <p className="text-muted-foreground/60 text-sm mt-1">
            F11 for Full Screen
          </p>
        </div>
      )}

      {/* Video Player */}
      {activeWindow && (
        <VideoPlayer
          videoId={activeWindow.videoId}
          title={activeWindow.title}
          onClose={handleClose}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        />
      )}

      {/* Windows Grid - matching original layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {windows.map((window, index) => (
          <button
            key={window.id}
            onClick={() => handleWindowClick(window)}
            className={cn(
              "window-card flex items-center justify-center",
              "px-4 py-6 text-center",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              activeWindow?.id === window.id && "active",
              kioskMode && currentKioskIndex === index && "ring-2 ring-primary"
            )}
          >
            <h2 className="text-sm font-medium leading-tight">
              {window.title}
            </h2>
          </button>
        ))}

        {/* Random Window Button */}
        <button
          onClick={handleRandomWindow}
          className={cn(
            "window-card flex flex-col items-center justify-center gap-2",
            "px-4 py-6 text-center",
            "focus:outline-none focus:ring-2 focus:ring-accent/50"
          )}
        >
          <Shuffle className="h-5 w-5 text-accent" />
          <h2 className="text-sm font-medium leading-tight">
            Random Window
          </h2>
        </button>
      </div>
    </div>
  )
}

export { windows }
