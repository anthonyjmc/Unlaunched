'use client'
import { useEffect, useRef } from 'react'

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!ref.current) return
      ref.current.style.left = e.clientX + 'px'
      ref.current.style.top  = e.clientY + 'px'
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return (
    <div ref={ref} style={{
      position:'fixed', zIndex:10000, pointerEvents:'none',
      transform:'translate(-50%,-50%)',
    }}>
      <svg width="16" height="16" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="2" fill="none" stroke="#a0a09c" strokeWidth="0.8"/>
        <line x1="8" y1="0.5" x2="8" y2="4.5" stroke="#a0a09c" strokeWidth="0.6" opacity="0.5"/>
        <line x1="8" y1="11.5" x2="8" y2="15.5" stroke="#a0a09c" strokeWidth="0.6" opacity="0.5"/>
        <line x1="0.5" y1="8" x2="4.5" y2="8" stroke="#a0a09c" strokeWidth="0.6" opacity="0.5"/>
        <line x1="11.5" y1="8" x2="15.5" y2="8" stroke="#a0a09c" strokeWidth="0.6" opacity="0.5"/>
      </svg>
    </div>
  )
}
