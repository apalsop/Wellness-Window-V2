"use client"

import { useState, useCallback } from "react"
import { VideoPlayer } from "./video-player"
import { cn } from "@/lib/utils"
import { Shuffle, Play } from "lucide-react"

export interface WindowItem {
  id: string
  title: string
  videoId: string
}

// Verified working YouTube video IDs with good thumbnails
export const windows: WindowItem[] = [
  { id: "jackson-hole", title: "Jackson Hole", videoId: "1EiC9bvVGnk" },
  { id: "venice-guglie", title: "Venice: Guglie", videoId: "ydYDqZQpim8" },
  { id: "venice-marks", title: "Venice: St. Marks", videoId: "PZPLz8CJNP8" },
  { id: "shibuya", title: "Shibuya Crossing", videoId: "gFRtAAmiFbE" },
  { id: "yellowstone", title: "Yellowstone", videoId: "RFH7HzviRdQ" },
  { id: "aurora", title: "Aurora Borealis", videoId: "WHTFuRdWYPM" },
  { id: "iss", title: "Earth & Space ISS", videoId: "P9C25Un7xaM" },
  { id: "fireplace", title: "Fireplace", videoId: "ITBtNXd5WJs" },
  { id: "anacapa", title: "Anacapa Island", videoId: "DbjIHCFGISI" },
  { id: "reef", title: "Underwater Reef", videoId: "r9LIasj1P_Q" },
  { id: "forest-stream", title: "Forest Stream", videoId: "Oifns9hCuLk" },
  { id: "kenya-waterhole", title: "Kenya Waterhole", videoId: "FxL4pWtCIqE" },
  { id: "city-drive", title: "City Drive & Radio", videoId: "5qap5aO4i9A" },
  { id: "autumn-forest", title: "Autumn Forest", videoId: "XpKwrYEBafo" },
  { id: "redwood", title: "Redwood Forest", videoId: "_1nnhg3JpwM" },
]

// Get YouTube thumbnail URL
function getThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {windows.map((window, index) => (
          <button
            key={window.id}
            onClick={() => handleWindowClick(window)}
            className={cn(
              "window-card group relative overflow-hidden rounded-lg",
              "border-2 border-border hover:border-primary",
              "transition-all duration-300",
              "focus:outline-none focus:ring-2 focus:ring-primary",
              activeWindow?.id === window.id && "ring-2 ring-primary border-primary",
              kioskMode && currentKioskIndex === index && "ring-2 ring-primary"
            )}
            style={{ aspectRatio: "16/9" }}
          >
            {/* Thumbnail Image */}
            <img
              src={getThumbnailUrl(window.videoId)}
              alt={window.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
            
            {/* Play icon on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            </div>
            
            {/* Title at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h2 className="text-sm font-semibold text-white text-center drop-shadow-lg">
                {window.title}
              </h2>
            </div>
          </button>
        ))}

        {/* Random Window Button */}
        <button
          onClick={handleRandomWindow}
          className={cn(
            "window-card group relative overflow-hidden rounded-lg",
            "border-2 border-dashed border-accent/50 hover:border-accent",
            "bg-card/50 transition-all duration-300",
            "focus:outline-none focus:ring-2 focus:ring-accent",
            "flex flex-col items-center justify-center gap-3"
          )}
          style={{ aspectRatio: "16/9" }}
        >
          <Shuffle className="w-8 h-8 text-accent transition-transform duration-300 group-hover:scale-110 group-hover:rotate-180" />
          <h2 className="text-sm font-semibold text-foreground">
            Random Window
          </h2>
        </button>
      </div>
    </div>
  )
}
