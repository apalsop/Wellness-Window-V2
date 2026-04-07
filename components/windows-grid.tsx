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

// Windows with CORRECT labels based on actual YouTube video titles
export const windows: WindowItem[] = [
  // 1EiC9bvVGnk = Jackson Hole Town Square (CORRECT)
  { id: "jackson-hole", title: "Jackson Hole Town Square", subtitle: "Wyoming, USA", videoId: "1EiC9bvVGnk" },
  
  // dfVK7ld38Ys = Shibuya Scramble Crossing (was mislabeled as Venice)
  { id: "shibuya", title: "Shibuya Scramble Crossing", subtitle: "Tokyo, Japan", videoId: "dfVK7ld38Ys" },
  
  // BWnloy8r0qU = Yellowstone / Old Faithful (was mislabeled as Shibuya)
  { id: "yellowstone", title: "Yellowstone National Park", subtitle: "Old Faithful Geyser", videoId: "BWnloy8r0qU" },
  
  // LhNF-UFpWNY = Aurora Borealis (CORRECT)
  { id: "aurora", title: "Aurora Borealis", subtitle: "Utsjoki, Finland", videoId: "LhNF-UFpWNY" },
  
  // fO9e9jnhYK8 = Earth from ISS (was mislabeled as Yellowstone)
  { id: "iss-earth", title: "Earth from Space", subtitle: "ISS Live 4K", videoId: "fO9e9jnhYK8" },
  
  // ydYDqZQpim8 = Namibia Waterhole
  { id: "namibia", title: "Namibia Waterhole", subtitle: "Wildlife Watch - Africa", videoId: "ydYDqZQpim8" },
  
  // aaUERtNMn7o = Anacapa Island Cove (CORRECT)
  { id: "anacapa", title: "Anacapa Island Cove", subtitle: "Channel Islands National Park", videoId: "aaUERtNMn7o" },
  
  // 1zcIUk66HX4 = Underwater Reef Cam (CORRECT but better title)
  { id: "underwater", title: "Underwater Reef Cam", subtitle: "Utopia Village, Honduras", videoId: "1zcIUk66HX4" },
  
  // LC-DK_22eK4 = African Safari Kenya (CORRECT)
  { id: "kenya-safari", title: "African Safari", subtitle: "Kenya Wildlife - MPALA", videoId: "LC-DK_22eK4" },
  
  // oORXfTviuCs = Watering Hole Kenya (CORRECT)
  { id: "kenya-waterhole", title: "Watering Hole", subtitle: "Kenya - MPALA", videoId: "oORXfTviuCs" },
  
  // L_LUpnjgPso = Fireplace 10 hours (CORRECT)
  { id: "fireplace", title: "Cozy Fireplace", subtitle: "10 Hours Full HD", videoId: "L_LUpnjgPso" },
  
  // xNN7iTA57jM = Forest Sounds / Woodland Ambience (was mislabeled as Autumn Forest)
  { id: "woodland", title: "Woodland Ambience", subtitle: "Forest Sounds & Bird Song", videoId: "xNN7iTA57jM" },
  
  // _1nnhg3JpwM = Redwood Forest Stream (USER PROVIDED CORRECT ID)
  { id: "redwood", title: "Redwood Forest", subtitle: "California Stream Ambience", videoId: "_1nnhg3JpwM" },
  
  // External links with Unsplash images
  { id: "window-swap", title: "Random Window Swap", subtitle: "Global Community Portal", externalUrl: "https://www.window-swap.com/window", thumbnailUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=320&h=180&fit=crop" },
  { id: "drive-listen", title: "City Drive & Radio", subtitle: "Immersive City Streets", externalUrl: "https://driveandlisten.app/", thumbnailUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=320&h=180&fit=crop" },
  { id: "walking-tour", title: "Virtual Walking Tour", subtitle: "100+ Cities & Locations", externalUrl: "https://virtualvacation.us/walk", thumbnailUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=320&h=180&fit=crop" },
  { id: "flyover", title: "Airplane City Flyover", subtitle: "Easygoing Expedition", externalUrl: "https://virtualvacation.us/fly", thumbnailUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=320&h=180&fit=crop" },
]

// Get YouTube thumbnail URL
function getThumbnailUrl(window: WindowItem): string {
  if (window.thumbnailUrl) return window.thumbnailUrl
  if (window.videoId) return `https://img.youtube.com/vi/${window.videoId}/mqdefault.jpg`
  return ""
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
              />
              
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
