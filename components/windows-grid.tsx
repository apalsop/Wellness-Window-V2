"use client"

import { useState, useCallback } from "react"
import { VideoPlayer } from "./video-player"
import { cn } from "@/lib/utils"
import { Play, ExternalLink } from "lucide-react"

export interface WindowItem {
  id: string
  title: string
  subtitle?: string
  videoId?: string
  externalUrl?: string
  thumbnailUrl?: string
}

// Windows in order per user request
export const windows: WindowItem[] = [
  // Button 1
  { id: "stream-1", title: "Jackson Hole Town Square", videoId: "1EiC9bvVGnk" },
  // Button 2 (was Button 3 in spec - continuing sequence)
  { id: "stream-2", title: "Venice Italy Live Cam", videoId: "dfVK7ld38Ys" },
  // Button 3
  { id: "stream-3", title: "Shibuya Scramble Crossing", videoId: "BWnloy8r0qU" },
  // Button 4
  { id: "stream-4", title: "Aurora Borealis / Northern Lights", subtitle: "Utsjoki, Finland", videoId: "LhNF-UFpWNY" },
  // Button 5
  { id: "stream-5", title: "Yellowstone Live", videoId: "fO9e9jnhYK8" },
  // Button 6 - Namibia Waterhole
  { id: "namibia", title: "Namibia Waterhole", subtitle: "Wildlife Watch - Africa", videoId: "ydYDqZQpim8" },
  // Button 7
  { id: "anacapa", title: "Anacapa Island Cove", subtitle: "Channel Islands National Park", videoId: "aaUERtNMn7o" },
  // Button 8
  { id: "stream-8", title: "Underwater Ocean Reef", videoId: "1zcIUk66HX4" },
  // Button 9
  { id: "kenya-safari", title: "African Safari - Kenya Wildlife", subtitle: "MPALA | explore.org", videoId: "LC-DK_22eK4" },
  // Button 10
  { id: "kenya-waterhole", title: "Watering Hole in Kenya", subtitle: "MPALA | explore.org", videoId: "oORXfTviuCs" },
  // Kept from previous - Fireplace
  { id: "fireplace", title: "Cozy Fireplace", subtitle: "Relaxing Ambiance", videoId: "L_LUpnjgPso" },
  // Kept - Autumn Forest
  { id: "autumn-forest", title: "Autumn Forest", subtitle: "Nature Relaxation", videoId: "dKNfX50GSi8" },
  // Kept - Redwood Forest
  { id: "redwood", title: "Redwood Forest", subtitle: "Pacific Coast", videoId: "jcTBVepzTGE" },
  // External links
  { id: "window-swap", title: "Random Window Swap", subtitle: "Global Community Portal", externalUrl: "https://www.window-swap.com/window", thumbnailUrl: "/window-swap-thumb.jpg" },
  { id: "drive-listen", title: "City Drive & Radio", subtitle: "Immersive City Streets", externalUrl: "https://driveandlisten.app/", thumbnailUrl: "/drive-listen-thumb.jpg" },
  { id: "walking-tour", title: "Virtual Walking Tour", subtitle: "100+ Cities & Locations", externalUrl: "https://virtualvacation.us/walking-tour", thumbnailUrl: "/walking-tour-thumb.jpg" },
  { id: "flyover", title: "Airplane City Flyover", subtitle: "Easygoing Expedition", externalUrl: "https://virtualvacation.us/flyover", thumbnailUrl: "/flyover-thumb.jpg" },
]

// Get YouTube thumbnail URL
function getThumbnailUrl(window: WindowItem): string {
  if (window.thumbnailUrl) return window.thumbnailUrl
  if (window.videoId) return `https://img.youtube.com/vi/${window.videoId}/mqdefault.jpg`
  return "/placeholder-thumb.jpg"
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
    // External links open in new tab
    if (window.externalUrl) {
      globalThis.open(window.externalUrl, "_blank")
      return
    }
    setSelectedWindow(window)
    onWindowSelect(window)
  }, [onWindowSelect])

  const handleClose = useCallback(() => {
    setSelectedWindow(null)
    setIsFullscreen(false)
    onWindowSelect(null)
  }, [onWindowSelect])

  // In kiosk mode, auto-select the current window (skip external links)
  const youtubeWindows = windows.filter(w => w.videoId)
  const activeWindow = kioskMode ? youtubeWindows[currentKioskIndex % youtubeWindows.length] : selectedWindow

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
      {activeWindow && activeWindow.videoId && (
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
        {windows.map((window, index) => {
          const isExternal = !!window.externalUrl
          const isActive = activeWindow?.id === window.id
          
          return (
            <button
              key={window.id}
              onClick={() => handleWindowClick(window)}
              className={cn(
                "window-card group relative overflow-hidden rounded-lg",
                "border-2 border-border hover:border-primary",
                "transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-primary",
                isActive && "ring-2 ring-primary border-primary",
                kioskMode && !isExternal && currentKioskIndex === index && "ring-2 ring-primary"
              )}
              style={{ aspectRatio: "16/9" }}
            >
              {/* Thumbnail Image */}
              <img
                src={getThumbnailUrl(window)}
                alt={window.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  // Fallback for missing thumbnails
                  e.currentTarget.style.display = 'none'
                }}
              />
              
              {/* Fallback background for external links */}
              {isExternal && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
              )}
              
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
              
              {/* Play/External icon on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center">
                  {isExternal ? (
                    <ExternalLink className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white fill-white" />
                  )}
                </div>
              </div>
              
              {/* Title and subtitle at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h2 className="text-sm font-semibold text-white text-center drop-shadow-lg leading-tight">
                  {window.title}
                </h2>
                {window.subtitle && (
                  <p className="text-xs text-white/70 text-center mt-0.5 drop-shadow">
                    {window.subtitle}
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
