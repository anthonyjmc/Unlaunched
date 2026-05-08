'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, useCallback } from 'react'
import { ARTWORKS, CAROUSEL_ORDER } from '@/lib/artworks'
import React from 'react'

interface Props {
  solved: boolean[]
  onOpen: (artworkId: number) => void
}

export default function Carousel({ solved, onOpen }: Props) {
  const [angle, setAngle]         = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(0)
  const angleRef    = useRef(0)
  const targetRef   = useRef(0)
  const animRef     = useRef<number | null>(null)
  const N = CAROUSEL_ORDER.length
  const isMobile = viewportWidth > 0 && viewportWidth < 768

  useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Card positions
  const getCardStyle = (cardIndex: number, currentAngle: number) => {
    const theta  = (cardIndex / N) * 360 + currentAngle
    const rad    = theta * Math.PI / 180
    const r      = isMobile ? Math.min(440, Math.max(260, viewportWidth * 0.62)) : 720
    const x      = Math.sin(rad) * r
    const z      = Math.cos(rad) * r - r
    const cosVal = (Math.cos(rad) + 1) / 2
    const scale  = 0.42 + 0.58 * cosVal
    const opacity= 0.15 + 0.85 * cosVal
    const blur   = Math.max(0, 4 * (1 - cosVal))
    return { x, z, scale, opacity, blur, isActive: scale > 0.88 }
  }

  const rotate = useCallback((dir: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    targetRef.current += dir * (360 / N)
    const start    = angleRef.current
    const end      = targetRef.current
    const duration = 900
    const t0       = performance.now()

    const anim = (now: number) => {
      const t = Math.min((now - t0) / duration, 1)
      const e = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2
      angleRef.current = start + (end - start) * e
      setAngle(angleRef.current)
      if (t < 1) animRef.current = requestAnimationFrame(anim)
      else { angleRef.current = end; setAngle(end); setIsAnimating(false) }
    }
    animRef.current = requestAnimationFrame(anim)
  }, [isAnimating, N])

  // Wheel scroll
  useEffect(() => {
    if (isMobile) return
    const el = document.getElementById('pg-gallery')
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (e.deltaY > 40) rotate(-1)
      else if (e.deltaY < -40) rotate(1)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [rotate, isMobile])

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowRight','ArrowDown'].includes(e.key)) rotate(-1)
      if (['ArrowLeft','ArrowUp'].includes(e.key))   rotate(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [rotate])

  // Swipe (mobile)
  useEffect(() => {
    if (!isMobile) return
    const el = document.getElementById('pg-gallery')
    if (!el) return

    let startX = 0
    let startY = 0
    let hasMoved = false

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      startX = t.clientX
      startY = t.clientY
      hasMoved = false
    }

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      const dx = t.clientX - startX
      const dy = t.clientY - startY
      if (Math.abs(dx) < 18 || Math.abs(dx) < Math.abs(dy)) return
      hasMoved = true
      e.preventDefault()
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (!hasMoved) return
      const t = e.changedTouches[0]
      if (!t) return
      const dx = t.clientX - startX
      if (Math.abs(dx) < 42) return
      if (dx < 0) rotate(-1)
      else rotate(1)
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [isMobile, rotate])

  return (
    <div
      id="carousel-wrap"
      style={{
        position:'absolute', inset:0, top:80, bottom:isMobile ? 152 : 112,
        display:'flex', alignItems:'center', justifyContent:'center',
        perspective:'1200px', perspectiveOrigin:'50% 50%',
        touchAction: isMobile ? 'pan-y' : 'auto',
      }}
    >
      
      <div style={{
        width: isMobile ? 'min(78vw, 320px)' : 'clamp(300px,38vw,420px)',
        height: isMobile ? 'min(96vw, 400px)' : 'clamp(360px,46vw,500px)',
        position:'relative', transformStyle:'preserve-3d',
      }}>
        {CAROUSEL_ORDER.map((artworkId, cardIndex) => {
          const artwork  = ARTWORKS[artworkId]
          const style    = getCardStyle(cardIndex, angle)
          const isSolved = solved[artworkId]

          return (
            <div
              key={artworkId}
              onClick={() => style.isActive && onOpen(artworkId)}
              style={{
                position:'absolute', inset:0,
                transform:`translateX(${style.x}px) translateZ(${style.z}px) scale(${style.scale})`,
                opacity: style.opacity,
                filter:  style.blur > 0.3 ? `blur(${style.blur.toFixed(1)}px)` : 'none',
                zIndex:  Math.round(style.scale * 10),
                pointerEvents: style.isActive ? 'auto' : 'none',
                cursor:  'none',
                transformStyle: 'preserve-3d',
              }}
            >
              <div style={{
                position:'absolute', bottom:'100%', left:'50%',
                transform:'translateX(-50%)',
                width:'180%', height:'200px',
                background:'radial-gradient(ellipse at bottom, rgba(240,240,236,0.08) 0%, transparent 65%)',
                pointerEvents:'none',
                opacity: style.isActive ? 1 : 0,
                transition:'opacity 0.8s ease',
              }}/>
              <div style={{
                position:'absolute', inset:0,
                display:'flex', flexDirection:'column',
                alignItems:'center', gap:14,
              }}>
                {/* Frame */}
                <div style={{
                  width:'100%', flex:1,
                  background:'transparent',
                  border: isSolved
                    ? '1px solid rgba(240,240,236,0.28)'
                    : '1px solid rgba(240,240,236,0.1)',
                  overflow:'hidden', position:'relative',
                  transition:'border-color 0.4s',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  if (isMobile) return
                  if (!style.isActive) return
                  e.currentTarget.style.borderColor = 'rgba(240,240,236,0.3)'
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(240,240,236,0.06)'
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  if (isMobile) return
                  e.currentTarget.style.borderColor = isSolved
                    ? 'rgba(240,240,236,0.28)'
                    : 'rgba(240,240,236,0.1)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                >
                  <Image
                    src={artwork.src}
                    alt={artwork.alt}
                    fill
                    sizes="(max-width: 768px) 86vw, 420px"
                    draggable={false}
                    style={{ objectFit:'cover', userSelect:'none' }}
                  />
                </div>

                {/* Label */}
                <div style={{ textAlign:'center', width:'100%' }}>
                  <div style={{
                    fontSize:13, fontWeight:400, letterSpacing:'0.16em',
                    color:'var(--light)', textTransform:'uppercase', marginBottom:3,
                  }}>
                    {artwork.title}
                  </div>
                  {!isSolved && (
                    <div style={{
                      fontSize:11, letterSpacing:'0.18em',
                      color:'var(--dim)', textTransform:'uppercase',
                      animation:'dimP 4s ease-in-out infinite',
                    }}>
                      Click to search for the words.
                    </div>
                  )}
                  {isSolved && (
                    <div style={{
                      fontSize:11, letterSpacing:'0.18em',
                      color:'var(--light)', textTransform:'uppercase',
                    }}>
                      Word found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
