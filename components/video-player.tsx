"use client"

import { X, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
  videoId: string
  title: string
  onClose: () => void
  isFullscreen: boolean
  onToggleFullscreen: () => void
}

export function VideoPlayer({ 
  videoId, 
  title, 
  onClose, 
  isFullscreen,
  onToggleFullscreen 
}: VideoPlayerProps) {
  const getEmbedUrl = (id: string) => {
    if (id.includes("youtube.com") || id.includes("youtu.be")) {
      const match = id.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/)
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1`
      }
    }
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`
  }

  return (
    <div className={cn(
      "bg-card border border-border rounded-lg overflow-hidden transition-all duration-300",
      isFullscreen 
        ? "fixed inset-4 z-50" 
        : "relative w-full aspect-video"
    )}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-3 bg-gradient-to-b from-black/70 to-transparent">
        <h3 className="text-sm font-medium text-white truncate pr-4">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFullscreen}
            className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close video"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Video iframe */}
      <iframe
        src={getEmbedUrl(videoId)}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title}
      />
    </div>
  )
}
