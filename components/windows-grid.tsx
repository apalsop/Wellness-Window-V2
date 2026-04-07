"use client"

import { useState, useCallback } from "react"
import { VideoPlayer } from "./video-player"
import { cn } from "@/lib/utils"
import { Shuffle } from "lucide-react"
import Image from "next/image"

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

// Get YouTube thumbnail URL
function getThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

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

      {/* Windows Grid with Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {windows.map((window, index) => (
          <button
            key={window.id}
            onClick={() => handleWindowClick(window)}
            className={cn(
              "group relative aspect-video overflow-hidden rounded-lg",
              "border border-border hover:border-primary/50",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              activeWindow?.id === window.id && "ring-2 ring-primary border-primary",
              kioskMode && currentKioskIndex === index && "ring-2 ring-primary"
            )}
          >
            {/* Thumbnail Image */}
            <Image
              src={getThumbnailUrl(window.videoId)}
              alt={window.title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
              unoptimized
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Title */}
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <h2 className="text-xs sm:text-sm font-medium text-white leading-tight drop-shadow-lg">
                {window.title}
              </h2>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>
        ))}

        {/* Random Window Button */}
        <button
          onClick={handleRandomWindow}
          className={cn(
            "group relative aspect-video overflow-hidden rounded-lg",
            "border border-border hover:border-accent/50",
            "bg-card transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-accent/50",
            "flex flex-col items-center justify-center gap-2"
          )}
        >
          <Shuffle className="h-6 w-6 text-accent transition-transform duration-200 group-hover:scale-110" />
          <h2 className="text-xs sm:text-sm font-medium text-foreground leading-tight">
            Random Window
          </h2>
        </button>
      </div>
    </div>
  )
}

export { windows }
