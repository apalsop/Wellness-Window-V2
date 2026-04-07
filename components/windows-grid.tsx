"use client"

import { useState, useCallback } from "react"
import { VideoPlayer } from "./video-player"
import { cn } from "@/lib/utils"
import { 
  Mountain, 
  Building2, 
  Footprints, 
  Rocket, 
  Fish, 
  TreeDeciduous,
  Car,
  Plane,
  Shuffle,
  Sparkles
} from "lucide-react"

export interface WindowItem {
  id: string
  title: string
  videoId: string
  icon: React.ReactNode
  category: "nature" | "city" | "space" | "adventure"
}

const windows: WindowItem[] = [
  {
    id: "jackson-hole",
    title: "Jackson Hole",
    videoId: "1G2bKrh7CKw",
    icon: <Mountain className="h-6 w-6" />,
    category: "nature",
  },
  {
    id: "venice-guglie",
    title: "Venice: Guglie",
    videoId: "ydYDqZQpim8",
    icon: <Building2 className="h-6 w-6" />,
    category: "city",
  },
  {
    id: "venice-marks",
    title: "Venice: St. Marks",
    videoId: "c0JVQLN4EqI",
    icon: <Building2 className="h-6 w-6" />,
    category: "city",
  },
  {
    id: "shibuya",
    title: "Shibuya Crossing",
    videoId: "3n6Rre3l5jE",
    icon: <Footprints className="h-6 w-6" />,
    category: "city",
  },
  {
    id: "yellowstone",
    title: "Yellowstone",
    videoId: "6B4ZPl0LCVM",
    icon: <Sparkles className="h-6 w-6" />,
    category: "nature",
  },
  {
    id: "aurora",
    title: "Aurora Borealis",
    videoId: "WHTFuRdWYPM",
    icon: <Sparkles className="h-6 w-6" />,
    category: "nature",
  },
  {
    id: "iss",
    title: "Earth & Space ISS",
    videoId: "P9C25Un7xaM",
    icon: <Rocket className="h-6 w-6" />,
    category: "space",
  },
  {
    id: "namibia",
    title: "Namibia",
    videoId: "ydYDqZQpim8",
    icon: <TreeDeciduous className="h-6 w-6" />,
    category: "nature",
  },
  {
    id: "anacapa",
    title: "Anacapa Island",
    videoId: "OmkGFrBQQaE",
    icon: <Mountain className="h-6 w-6" />,
    category: "nature",
  },
  {
    id: "reef",
    title: "Underwater Reef",
    videoId: "r9LIasj1P_Q",
    icon: <Fish className="h-6 w-6" />,
    category: "adventure",
  },
  {
    id: "kenya-safari",
    title: "Kenya Safari",
    videoId: "IUfzqSVSYbA",
    icon: <TreeDeciduous className="h-6 w-6" />,
    category: "adventure",
  },
  {
    id: "kenya-waterhole",
    title: "Kenya Waterhole",
    videoId: "FxL4pWtCIqE",
    icon: <TreeDeciduous className="h-6 w-6" />,
    category: "adventure",
  },
  {
    id: "city-drive",
    title: "City Drive & Radio",
    videoId: "5qap5aO4i9A",
    icon: <Car className="h-6 w-6" />,
    category: "city",
  },
  {
    id: "walking",
    title: "Walking Tour",
    videoId: "8ybW48rKBME",
    icon: <Footprints className="h-6 w-6" />,
    category: "city",
  },
  {
    id: "flyover",
    title: "Airplane Flyover",
    videoId: "qVrMd3DjzVA",
    icon: <Plane className="h-6 w-6" />,
    category: "adventure",
  },
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

      {/* Instructions */}
      {!activeWindow && (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-muted-foreground text-lg">
            Select a Window to begin your journey
          </p>
          <p className="text-muted-foreground/60 text-sm mt-2">
            Press F11 for Full Screen experience
          </p>
        </div>
      )}

      {/* Windows Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {windows.map((window, index) => (
          <button
            key={window.id}
            onClick={() => handleWindowClick(window)}
            className={cn(
              "glass-subtle group relative flex flex-col items-center justify-center",
              "p-4 rounded-xl aspect-square",
              "transition-all duration-300 ease-out",
              "hover:scale-105 hover:bg-primary/10 hover:border-primary/30",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              "active:scale-95",
              activeWindow?.id === window.id && "bg-primary/20 border-primary/50 scale-105",
              kioskMode && currentKioskIndex === index && "ring-2 ring-primary animate-pulse"
            )}
          >
            <span className={cn(
              "text-muted-foreground group-hover:text-primary transition-colors",
              activeWindow?.id === window.id && "text-primary"
            )}>
              {window.icon}
            </span>
            <span className={cn(
              "mt-2 text-xs font-medium text-center text-foreground/80",
              "group-hover:text-foreground transition-colors",
              "line-clamp-2"
            )}>
              {window.title}
            </span>
          </button>
        ))}

        {/* Random Window Button */}
        <button
          onClick={handleRandomWindow}
          className={cn(
            "glass-subtle group relative flex flex-col items-center justify-center",
            "p-4 rounded-xl aspect-square",
            "transition-all duration-300 ease-out",
            "hover:scale-105 hover:bg-accent/20 hover:border-accent/30",
            "focus:outline-none focus:ring-2 focus:ring-accent/50",
            "active:scale-95",
            "bg-gradient-to-br from-primary/5 to-accent/5"
          )}
        >
          <Shuffle className="h-6 w-6 text-accent group-hover:animate-spin" />
          <span className="mt-2 text-xs font-medium text-center text-foreground/80 group-hover:text-foreground">
            Random Window
          </span>
        </button>
      </div>
    </div>
  )
}

export { windows }
