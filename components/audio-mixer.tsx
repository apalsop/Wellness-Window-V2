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
    icon: <CloudRain className="h-5 w-5" />,
    url: "https://cdn.pixabay.com/audio/2022/05/16/audio_1fc75b5261.mp3", // Rain sounds
  },
  {
    id: "waves",
    label: "WAVES",
    icon: <Waves className="h-5 w-5" />,
    url: "https://cdn.pixabay.com/audio/2024/07/30/audio_ac440445a6.mp3", // Ocean waves
  },
  {
    id: "forest",
    label: "FOREST",
    icon: <TreePine className="h-5 w-5" />,
    url: "https://cdn.pixabay.com/audio/2022/03/12/audio_4c26ed1d2a.mp3", // Forest birds
  },
  {
    id: "lofi",
    label: "LO-FI",
    icon: <Music className="h-5 w-5" />,
    url: "https://cdn.pixabay.com/audio/2022/11/08/audio_d87c3ddc95.mp3", // Lo-fi beats
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
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    // If clicking the same button, just stop
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

  // Update volume when slider changes
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
    <div className="glass rounded-2xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
          Ambient Mixer
        </h2>
        {activeAudio && (
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
            />
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {audioSources.map((source) => (
          <button
            key={source.id}
            onClick={() => playAudio(source)}
            disabled={isLoading && activeAudio !== source.id}
            className={cn(
              "glass-subtle flex items-center gap-2 px-4 py-2.5 rounded-xl",
              "text-sm font-medium tracking-wide",
              "transition-all duration-300 ease-out",
              "hover:scale-105 active:scale-95",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              activeAudio === source.id
                ? "bg-primary/20 text-primary border-primary/50 shadow-lg shadow-primary/20"
                : "text-foreground/80 hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <span className={cn(
              "transition-transform duration-300",
              activeAudio === source.id && "animate-pulse"
            )}>
              {source.icon}
            </span>
            <span>{source.label}</span>
          </button>
        ))}
        
        <button
          onClick={stopAudio}
          className={cn(
            "glass-subtle flex items-center gap-2 px-4 py-2.5 rounded-xl",
            "text-sm font-medium tracking-wide",
            "transition-all duration-300 ease-out",
            "hover:scale-105 active:scale-95",
            "focus:outline-none focus:ring-2 focus:ring-destructive/50",
            activeAudio === null
              ? "text-muted-foreground"
              : "text-destructive hover:bg-destructive/10 border-destructive/30"
          )}
        >
          <VolumeX className="h-5 w-5" />
          <span>OFF</span>
        </button>
      </div>
    </div>
  )
}
