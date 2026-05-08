'use client'

// ─────────────────────────────────────────────
// AMBIENT MUSIC
// Loops a low-volume soundtrack across the experience. Mute state is persisted
// in sessionStorage so it survives tab navigation but resets per browser
// session. The audio file is loaded from /public/audio (place yours there).
// ─────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'

interface AmbientMusicProps {
  src?: string
  volume?: number
}

const STORAGE_KEY = 'ambient-music-muted'

export function AmbientMusic({
  src = '/audio/suspense.mp3',
  volume = 0.4,
}: AmbientMusicProps) {
  const audioRef = useRef<HTMLAudioElement>(null)

  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setIsMuted(window.sessionStorage.getItem(STORAGE_KEY) === 'true')
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    audio.muted = isMuted
    if (!isMuted) audio.play().catch(() => { /* autoplay blocked, resumes on user interaction */ })
  }, [volume, isMuted])

  useEffect(() => {
    if (typeof window !== 'undefined')
      window.sessionStorage.setItem(STORAGE_KEY, String(isMuted))
  }, [isMuted])

  const handleToggle = () => setIsMuted(prev => !prev)

  const iconColor = isHovered ? 'var(--white)' : (isMuted ? 'var(--mid)' : 'var(--light)')
  const borderColor = isHovered ? 'var(--white)' : 'var(--border2)'

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      <button
        type="button"
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={isMuted ? 'Unmute ambient music' : 'Mute ambient music'}
        style={{
          position:'fixed', bottom:16, right:16, zIndex:350,
          width:38, height:38,
          background:'rgba(8,8,8,0.75)',
          border:`1px solid ${borderColor}`,
          borderRadius:'50%',
          display:'flex', alignItems:'center', justifyContent:'center',
          color: iconColor,
          cursor:'none',
          padding:0,
          transition:'border-color 0.25s ease, color 0.25s ease',
        }}
      >
        {isMuted ? <SpeakerMutedIcon /> : <SpeakerOnIcon />}
      </button>
    </>
  )
}

function SpeakerOnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h2l3.5-3v10L5 10H3z" fill="currentColor" fillOpacity="0.15"/>
      <path d="M11 5.5c1 0.7 1.5 1.7 1.5 2.5s-0.5 1.8-1.5 2.5"/>
      <path d="M12.5 4c1.5 1 2.3 2.4 2.3 4s-0.8 3-2.3 4" opacity="0.7"/>
    </svg>
  )
}

function SpeakerMutedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h2l3.5-3v10L5 10H3z" fill="currentColor" fillOpacity="0.15"/>
      <line x1="11" y1="6" x2="14.5" y2="9.5"/>
      <line x1="14.5" y1="6" x2="11" y2="9.5"/>
    </svg>
  )
}
