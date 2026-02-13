import { useState, useRef, useEffect } from 'react'
import './BackgroundMusic.css'

const STORAGE_KEY = 'petr-music-enabled'
const DEFAULT_VOLUME = 0.3

function getStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const stored = getStored()
    setIsPlaying(stored)
  }, [])

  useEffect(() => {
    const audio = new Audio(`${import.meta.env.BASE_URL}background-music.mp3`)
    audio.loop = true
    audio.volume = DEFAULT_VOLUME
    audio.preload = 'metadata'
    audio.addEventListener('canplaythrough', () => setReady(true))
    audio.addEventListener('error', () => setReady(false))
    audioRef.current = audio
    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying && ready) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [isPlaying, ready])

  const toggle = () => {
    const next = !isPlaying
    setIsPlaying(next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      className={`background-music ${isPlaying ? 'background-music--on' : ''}`}
      onClick={toggle}
      title={isPlaying ? 'Выключить музыку' : 'Включить музыку'}
      aria-label={isPlaying ? 'Выключить музыку' : 'Включить музыку'}
    >
      <span className="background-music__icon" aria-hidden>
        {isPlaying ? '🔊' : '🔇'}
      </span>
    </button>
  )
}
