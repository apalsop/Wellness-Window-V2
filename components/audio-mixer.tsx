"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { CloudRain, Waves, TreePine, Music, VolumeX, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

type AudioType = "rain" | "waves" | "forest" | "lofi" | null

interface AudioSource {
  id: AudioType
  label: string
  icon: React.ReactNode
  // Using multiple fallback URLs for reliability
  urls: string[]
}

// Using reliable free audio sources - multiple fallbacks per sound
const audioSources: AudioSource[] = [
  {
    id: "rain",
    label: "RAIN",
    icon: <CloudRain className="h-4 w-4" />,
    urls: [
      "https://sounds.pond5.com/rain-forest-sound-effect-049568668_nw_preview.m4a",
      "https://freesound.org/data/previews/531/531947_5828667-lq.mp3",
    ],
  },
  {
    id: "waves",
    label: "WAVES",
    icon: <Waves className="h-4 w-4" />,
    urls: [
      "https://sounds.pond5.com/ocean-waves-sound-effect-059498516_nw_preview.m4a",
      "https://freesound.org/data/previews/467/467919_8407711-lq.mp3",
    ],
  },
  {
    id: "forest",
    label: "FOREST",
    icon: <TreePine className="h-4 w-4" />,
    urls: [
      "https://sounds.pond5.com/forest-birds-ambience-sound-effect-029587932_nw_preview.m4a",
      "https://freesound.org/data/previews/525/525208_36001-lq.mp3",
    ],
  },
  {
    id: "lofi",
    label: "LO-FI",
    icon: <Music className="h-4 w-4" />,
    urls: [
      "https://sounds.pond5.com/lofi-hip-hop-beat-royalty-free-music-100085692_nw_preview.m4a",
      "https://freesound.org/data/previews/612/612095_5674468-lq.mp3",
    ],
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

  const tryPlayAudio = useCallback(async (urls: string[], index: number = 0): Promise<HTMLAudioElement | null> => {
    if (index >= urls.length) {
      return null
    }

    return new Promise((resolve) => {
      const audio = new Audio()
      audio.crossOrigin = "anonymous"
      
      const handleCanPlay = () => {
        cleanup()
        resolve(audio)
      }
      
      const handleError = () => {
        cleanup()
        // Try next URL
        tryPlayAudio(urls, index + 1).then(resolve)
      }
      
      const cleanup = () => {
        audio.removeEventListener("canplaythrough", handleCanPlay)
        audio.removeEventListener("error", handleError)
      }
      
      audio.addEventListener("canplaythrough", handleCanPlay)
      audio.addEventListener("error", handleError)
      
      audio.src = urls[index]
      audio.load()
    })
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
      const audio = await tryPlayAudio(source.urls)
      
      if (audio) {
        audio.loop = true
        audio.volume = volume
        audioRef.current = audio
        
        await audio.play()
        setIsLoading(false)
      } else {
        setError("Unable to load audio")
        setIsLoading(false)
        setActiveAudio(null)
      }
    } catch (err) {
      console.error("Audio playback error:", err)
      setError("Click to retry")
      setIsLoading(false)
      setActiveAudio(null)
    }
  }, [activeAudio, volume, stopAudio, tryPlayAudio])

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
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        {audioSources.map((source) => (
          <button
            key={source.id}
            onClick={() => playAudio(source)}
            disabled={isLoading && activeAudio !== source.id}
            className={cn(
              "audio-btn flex items-center justify-center gap-2 flex-1 min-w-0 px-3 py-2.5",
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
            "audio-btn flex items-center justify-center gap-2 flex-1 min-w-0 px-3 py-2.5",
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
