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

const audioSources: AudioSource[] = [
  {
    id: "rain",
    label: "RAIN",
    icon: <CloudRain className="h-4 w-4" />,
    url: "https://cdn.pixabay.com/audio/2022/05/16/audio_1fc75b5261.mp3",
  },
  {
    id: "waves",
    label: "WAVES",
    icon: <Waves className="h-4 w-4" />,
    url: "https://cdn.pixabay.com/audio/2024/07/30/audio_ac440445a6.mp3",
  },
  {
    id: "forest",
    label: "FOREST",
    icon: <TreePine className="h-4 w-4" />,
    url: "https://cdn.pixabay.com/audio/2022/03/12/audio_4c26ed1d2a.mp3",
  },
  {
    id: "lofi",
    label: "LO-FI",
    icon: <Music className="h-4 w-4" />,
    url: "https://cdn.pixabay.com/audio/2022/11/08/audio_d87c3ddc95.mp3",
  },
]

export function AudioMixer() {
  const [activeAudio, setActiveAudio] = useState<AudioType>(null)
  const [volume, setVolume] = useState(0.5)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setActiveAudio(null)
    setIsLoading(false)
  }, [])

  const playAudio = useCallback((source: AudioSource) => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    if (activeAudio === source.id) {
      stopAudio()
      return
    }

    setIsLoading(true)
    const audio = new Audio(source.url)
    audio.loop = true
    audio.volume = volume
    audioRef.current = audio

    audio.addEventListener("canplaythrough", () => {
      setIsLoading(false)
      audio.play().catch(console.error)
    })

    audio.addEventListener("error", () => {
      setIsLoading(false)
      console.error("Failed to load audio:", source.label)
    })

    setActiveAudio(source.id)
  }, [activeAudio, volume, stopAudio])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

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
      <div className="flex flex-wrap items-center gap-3">
        {/* Audio Buttons */}
        {audioSources.map((source) => (
          <button
            key={source.id}
            onClick={() => playAudio(source)}
            disabled={isLoading && activeAudio !== source.id}
            className={cn(
              "audio-btn flex items-center gap-2",
              activeAudio === source.id && "active"
            )}
          >
            <span className={cn(activeAudio === source.id && "animate-pulse")}>
              {source.icon}
            </span>
            <span>{source.label}</span>
          </button>
        ))}
        
        {/* OFF Button */}
        <button
          onClick={stopAudio}
          className={cn(
            "audio-btn flex items-center gap-2",
            activeAudio === null ? "opacity-50" : "hover:border-destructive hover:text-destructive"
          )}
        >
          <VolumeX className="h-4 w-4" />
          <span>OFF</span>
        </button>

        {/* Volume Slider */}
        {activeAudio && (
          <div className="flex items-center gap-2 ml-auto">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
            />
          </div>
        )}
      </div>
    </div>
  )
}
