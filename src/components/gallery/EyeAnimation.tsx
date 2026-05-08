'use client'

import { useEffect, useRef, useState } from 'react'

interface EyeAnimationProps {
  size?: string | number
}

export default function EyeAnimation({
  size = 'clamp(200px, 28vw, 360px)',
}: EyeAnimationProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pupilX, setPupilX] = useState(0)
  const [pupilY, setPupilY] = useState(0)
  const [isAlert, setIsAlert] = useState(false)
  const [blink, setBlink] = useState(false)

  // Cursor tracking
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!containerRef.current) return
      const r   = containerRef.current.getBoundingClientRect()
      const cx  = r.left + r.width  / 2
      const cy  = r.top  + r.height / 2
      const dx  = e.clientX - cx
      const dy  = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const max  = 18
      const factor = Math.min(dist, 180) / 180
      setPupilX((dx / (dist || 1)) * max * factor)
      setPupilY((dy / (dist || 1)) * max * factor)
      setIsAlert(dist < 80)
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  // Natural blink loop
  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 5000
      return setTimeout(() => {
        setBlink(true)
        setTimeout(() => {
          setBlink(false)
          scheduleBlink()
        }, 200)
      }, delay)
    }
    const t = scheduleBlink()
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', inset: -40,
        borderRadius: '50%',
        background: isAlert
          ? 'radial-gradient(circle, rgba(200,200,180,0.07) 0%, transparent 65%)'
          : 'radial-gradient(circle, rgba(200,200,180,0.03) 0%, transparent 65%)',
        animation: 'eyeGlow 5s ease-in-out infinite',
        transition: 'background 0.5s ease',
        pointerEvents: 'none',
      }}/>

      <svg
        viewBox="0 0 360 360"
        style={{
          width: '100%', height: '100%',
          overflow: 'visible',
          animation: isAlert
            ? 'eyeTremor 0.08s steps(2) infinite'
            : 'eyeBreathe 5.5s ease-in-out infinite',
          filter: 'drop-shadow(0 0 30px rgba(200,200,180,0.06))',
        }}
      >
        <defs>
          <radialGradient id="irisGrad" cx="44%" cy="38%">
            <stop offset="0%"   stopColor="#4a4a42"/>
            <stop offset="50%"  stopColor="#1e1e1c"/>
            <stop offset="100%" stopColor="#080808"/>
          </radialGradient>
          <radialGradient id="pupilGrad" cx="38%" cy="33%">
            <stop offset="0%"   stopColor="#181818"/>
            <stop offset="100%" stopColor="#000000"/>
          </radialGradient>
        </defs>

        {/* Veins */}
        <path
          d="M106,180 Q130,162 156,170"
          fill="none" stroke="#c8c8b8" strokeWidth="0.8"
          style={{ strokeDasharray: 50, strokeDashoffset: 50, animation: 'veinFlow 5s ease-in-out infinite' }}
        />
        <path
          d="M254,180 Q230,163 204,171"
          fill="none" stroke="#c8c8b8" strokeWidth="0.8"
          style={{ strokeDasharray: 50, strokeDashoffset: 50, animation: 'veinFlow 5s 1.5s ease-in-out infinite' }}
        />

        {/* Sclera */}
        <ellipse cx="180" cy="180" rx="100" ry="52"
          fill="#0d0d0b" stroke="#242420" strokeWidth="1.2"/>

        {/* Iris */}
        <circle cx="180" cy="180" r="38"
          fill="url(#irisGrad)" stroke="#181816" strokeWidth="1"/>
        <circle cx="180" cy="180" r="32"
          fill="none" stroke="#111110" strokeWidth="0.6" opacity="0.7"/>
        <circle cx="180" cy="180" r="26"
          fill="none" stroke="#0e0e0c" strokeWidth="0.4" opacity="0.5"/>

        {/* Pupil — moves with cursor */}
        <g style={{
          transform: `translate(${pupilX}px, ${pupilY}px)`,
          transition: 'transform 0.06s ease-out',
        }}>
          <circle cx="180" cy="180" r="20" fill="url(#pupilGrad)"/>
          <ellipse cx="187" cy="174" rx="6" ry="4"
            fill="white" opacity="0.06" transform="rotate(-20 187 174)"/>
          <circle cx="189" cy="173" r="2.5" fill="white" opacity="0.14"/>
        </g>

        {/* Limbal ring */}
        <circle cx="180" cy="180" r="38"
          fill="none" stroke="#040404" strokeWidth="5" opacity="0.95"/>

        {/* Eyelid — blink */}
        <g style={{
          transformOrigin: '180px 180px',
          transform: blink ? 'scaleY(1)' : 'scaleY(0)',
          transition: blink ? 'transform 0.08s ease-in' : 'transform 0.12s ease-out',
        }}>
          <ellipse cx="180" cy="180" rx="100" ry="52" fill="#040404"/>
          <ellipse cx="180" cy="130" rx="100" ry="52" fill="#040404"/>
        </g>

        {/* Lid edges */}
        <path d="M80,180 Q180,130 280,180"
          fill="none" stroke="#2a2a26" strokeWidth="1.5"/>
        <path d="M80,180 Q180,228 280,180"
          fill="none" stroke="#1a1a18" strokeWidth="1"/>

        {/* Tear ducts */}
        <ellipse cx="86"  cy="180" rx="8" ry="5" fill="#0a0a08" stroke="#1a1a18" strokeWidth="0.5"/>
        <ellipse cx="274" cy="180" rx="8" ry="5" fill="#0a0a08" stroke="#1a1a18" strokeWidth="0.5"/>
      </svg>

      <style>{`
        @keyframes eyeBreathe {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.02); }
        }
        @keyframes eyeTremor {
          0%   { transform: translate(0,0) scale(1.03); }
          50%  { transform: translate(-1px,1px) scale(1.03); }
          100% { transform: translate(1px,-1px) scale(1.03); }
        }
        @keyframes eyeGlow {
          0%,100% { transform: scale(1);   opacity: 0.5; }
          50%      { transform: scale(1.08); opacity: 1; }
        }
        @keyframes veinFlow {
          0%,100% { stroke-dashoffset: 50; opacity: 0; }
          35%,65% { stroke-dashoffset: 0;  opacity: 0.25; }
        }
      `}</style>
    </div>
  )
}
