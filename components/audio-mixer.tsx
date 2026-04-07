"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { CloudRain, Waves, TreePine, Music, VolumeX, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

type AudioType = "rain" | "waves" | "forest" | "lofi" | null

interface AudioSource {
  id: AudioType
  label: string
  icon: React.ReactNode
  // Using YouTube audio embed URLs from known working ambient channels
  youtubeId: string
}

// Using YouTube video IDs from popular ambient channels that are known to work
const audioSources: AudioSource[] = [
  {
    id: "rain",
    label: "RAIN",
    icon: <CloudRain className="h-4 w-4" />,
    youtubeId: "mPZkdNFkNps", // Rain sounds
  },
  {
    id: "waves",
    label: "WAVES",
    icon: <Waves className="h-4 w-4" />,
    youtubeId: "WHPEKLQID4U", // Ocean waves
  },
  {
    id: "forest",
    label: "FOREST",
    icon: <TreePine className="h-4 w-4" />,
    youtubeId: "xNN7iTA57jM", // Forest sounds
  },
  {
    id: "lofi",
    label: "LO-FI",
    icon: <Music className="h-4 w-4" />,
    youtubeId: "jfKfPfyJRdk", // Lofi Girl
  },
]

export function AudioMixer() {
  const [activeAudio, setActiveAudio] = useState<AudioType>(null)
  const [volume, setVolume] = useState(70)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const stopAudio = useCallback(() => {
    setActiveAudio(null)
  }, [])

  const playAudio = useCallback((source: AudioSource) => {
    // If same audio is playing, stop it
    if (activeAudio === source.id) {
      stopAudio()
      return
    }
    setActiveAudio(source.id)
  }, [activeAudio, stopAudio])

  // Get the current YouTube ID for the active audio
  const activeSource = audioSources.find(s => s.id === activeAudio)

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      {/* Audio buttons centered and evenly spaced */}
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {audioSources.map((source) => (
          <button
            key={source.id}
            onClick={() => playAudio(source)}
            className={cn(
              "audio-btn flex items-center justify-center gap-2 flex-1 max-w-[120px] px-3 py-2.5",
              activeAudio === source.id && "active"
            )}
          >
            <span className="shrink-0">
              {source.icon}
            </span>
            <span className="hidden sm:inline text-sm font-medium">{source.label}</span>
          </button>
        ))}
        
        {/* OFF Button */}
        <button
          onClick={stopAudio}
          className={cn(
            "audio-btn flex items-center justify-center gap-2 flex-1 max-w-[120px] px-3 py-2.5",
            activeAudio === null ? "opacity-50 cursor-default" : "hover:border-destructive hover:text-destructive"
          )}
          disabled={activeAudio === null}
        >
          <VolumeX className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline text-sm font-medium">OFF</span>
        </button>
      </div>

      {/* Hidden YouTube iframe for audio playback */}
      {activeSource && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground">
              Now playing: {activeSource.label}
            </span>
          </div>
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${activeSource.youtubeId}?autoplay=1&loop=1&playlist=${activeSource.youtubeId}`}
              title={activeSource.label}
              className="absolute inset-0 w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  )
}
