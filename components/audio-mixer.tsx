"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { CloudRain, Waves, TreePine, Music, VolumeX, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

type AudioType = "rain" | "waves" | "forest" | "lofi" | null

interface AudioSource {
  id: AudioType
  label: string
  icon: React.ReactNode
  url: string
}

// Using reliable, publicly accessible audio sources from Archive.org and other free CDNs
const audioSources: AudioSource[] = [
  {
    id: "rain",
    label: "RAIN",
    icon: <CloudRain className="h-4 w-4" />,
    url: "https://ia800905.us.archive.org/19/items/RaijinCD/RainAmbience.mp3",
  },
  {
    id: "waves",
    label: "WAVES",
    icon: <Waves className="h-4 w-4" />,
    url: "https://ia800503.us.archive.org/15/items/ocean_waves_sounds/ocean_waves.mp3",
  },
  {
    id: "forest",
    label: "FOREST",
    icon: <TreePine className="h-4 w-4" />,
    url: "https://ia600208.us.archive.org/12/items/forest-ambience-birds-nature-sounds/Forest%20Ambience%20-%20Birds%2C%20Nature%20Sounds.mp3",
  },
  {
    id: "lofi",
    label: "LO-FI",
    icon: <Music className="h-4 w-4" />,
    url: "https://ia800101.us.archive.org/14/items/LofiHipHop/Lofi%20Hip%20Hop.mp3",
  },
]

export function AudioMixer() {
  const [activeAudio, setActiveAudio] = useState<AudioType>(null)
  const [volume, setVolume] = useState(0.5)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setActiveAudio(null)
    setIsLoading(false)
    setError(null)
  }, [])

  const playAudio = useCallback(async (source: AudioSource) => {
    // If same audio is playing, stop it
    if (activeAudio === source.id) {
      stopAudio()
      return
    }

    // Stop any current audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    setIsLoading(true)
    setError(null)
    setActiveAudio(source.id)

    try {
      const audio = new Audio(source.url)
      audio.loop = true
      audio.volume = volume
      audioRef.current = audio
      
      audio.addEventListener("canplaythrough", () => {
        setIsLoading(false)
      }, { once: true })
      
      audio.addEventListener("error", () => {
        setError("Audio unavailable")
        setIsLoading(false)
        setActiveAudio(null)
        audioRef.current = null
      }, { once: true })
      
      await audio.play()
    } catch (err) {
      setError("Click to retry")
      setIsLoading(false)
      setActiveAudio(null)
    }
  }, [activeAudio, volume, stopAudio])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      {/* Audio buttons centered and evenly spaced */}
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {audioSources.map((source) => (
          <button
            key={source.id}
            onClick={() => playAudio(source)}
            disabled={isLoading && activeAudio !== source.id}
            className={cn(
              "audio-btn flex items-center justify-center gap-2 flex-1 max-w-[120px] px-3 py-2.5",
              activeAudio === source.id && "active",
              isLoading && activeAudio === source.id && "animate-pulse"
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

      {/* Error message */}
      {error && (
        <p className="text-xs text-destructive text-center mt-2">{error}</p>
      )}

      {/* Volume Slider - shown below when audio is active */}
      {activeAudio && !isLoading && (
        <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-border">
          <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-32 sm:w-48 h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
          />
          <span className="text-xs text-muted-foreground w-8">{Math.round(volume * 100)}%</span>
        </div>
      )}
    </div>
  )
}
