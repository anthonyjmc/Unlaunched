'use client'

import { useEffect, useRef, useState } from 'react'

interface CastleCinematicProps {
  onComplete?: () => void
}

export default function CastleCinematic({ onComplete }: CastleCinematicProps) {
  const [phase, setPhase] = useState<'cinematic' | 'message' | 'done'>('cinematic')
  const [messageVisible, setMessageVisible] = useState(false)
  const [line1, setLine1] = useState(false)
  const [line2, setLine2] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    // After cinematic → show message (faster)
    const t1 = setTimeout(() => {
      setPhase('message')
      setTimeout(() => setLine1(true), 220)
      setTimeout(() => setLine2(true), 880)
      setTimeout(() => setMessageVisible(true), 140)
    }, 9500)

    return () => clearTimeout(t1)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 900,
      width: '100vw',
      height: '100dvh',
      background: '#020202',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>

      {/* ── CINEMATIC BARS ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: isMobile ? 'clamp(40px,7vh,64px)' : 'clamp(56px,10vh,96px)',
        background: '#000',
        zIndex: 20,
        transition: phase === 'message' ? 'height 1.5s ease' : 'none',
      }}/>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: isMobile ? 'clamp(40px,7vh,64px)' : 'clamp(56px,10vh,96px)',
        background: '#000',
        zIndex: 20,
        transition: phase === 'message' ? 'height 1.5s ease' : 'none',
      }}/>

      {/* ── GRAIN ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 19,
        pointerEvents: 'none', opacity: 0.18,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
        animation: 'grain 0.12s steps(1) infinite',
      }}/>

      {/* ── VIGNETTE ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 18,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.98) 100%)',
      }}/>

      {/* ── CINEMATIC SCENE ── */}
      {phase === 'cinematic' && (
        <CastleScene isMobile={isMobile} />
      )}

      {/* ── FINAL MESSAGE ── */}
      {phase === 'message' && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 15,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 'clamp(16px,3vh,32px)',
          opacity: messageVisible ? 1 : 0,
          transition: 'opacity 1.2s ease',
        }}>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: isMobile ? 'clamp(16px,6vw,28px)' : 'clamp(18px,3vw,38px)',
            fontWeight: 300,
            letterSpacing: isMobile ? '0.06em' : '0.1em',
            color: '#f0f0ec',
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: 1.4,
            opacity: line2 ? 1 : 0,
            transform: line2 ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 1.8s ease, transform 1.8s ease',
            maxWidth: '92vw',
          }}>
            Coming Soon...
          </div>
          <div style={{
            fontSize: isMobile ? 'clamp(10px,2.6vw,12px)' : 'clamp(11px,1.3vw,15px)',
            letterSpacing: isMobile ? '0.22em' : '0.35em',
            color: 'rgba(200,200,180,0.5)',
            textTransform: 'uppercase',
            opacity: line1 ? 1 : 0,
            transform: line1 ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 1.4s ease, transform 1.4s ease',
            textAlign: 'center',
            maxWidth: '92vw',
          }}>
            June-15-2026
          </div>
        </div>
      )}

      <style>{`
        @keyframes grain {
          0%  { transform:translate(0,0); }
          33% { transform:translate(-1%,2%); }
          66% { transform:translate(2%,-1%); }
          100%{ transform:translate(-1%,1%); }
        }
        @keyframes fadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes dolly {
          0%   { transform: perspective(600px) translateZ(0px)   translateY(0px); }
          100% { transform: perspective(600px) translateZ(680px) translateY(-8px); }
        }
        @keyframes dollyMobile {
          0%   { transform: perspective(520px) translateZ(0px)   translateY(0px); }
          100% { transform: perspective(520px) translateZ(440px) translateY(-4px); }
        }
        @keyframes flickerLight {
          0%,100% { opacity: 0.6; }
          20%     { opacity: 0.3; }
          22%     { opacity: 0.7; }
          24%     { opacity: 0.2; }
          60%     { opacity: 0.5; }
          80%     { opacity: 0.65; }
        }
        @keyframes candleFlicker {
          0%,100% { opacity:0.7; transform:scaleY(1)   scaleX(1); }
          25%     { opacity:0.5; transform:scaleY(1.2) scaleX(0.8); }
          50%     { opacity:0.8; transform:scaleY(0.9) scaleX(1.1); }
          75%     { opacity:0.6; transform:scaleY(1.15) scaleX(0.9); }
        }
        @keyframes dustFloat {
          0%   { opacity:0;   transform:translateY(0)   translateX(0); }
          20%  { opacity:0.4; }
          80%  { opacity:0.2; }
          100% { opacity:0;   transform:translateY(-60px) translateX(20px); }
        }
        @keyframes fogDrift {
          0%   { transform:translateX(-5%) scaleX(1); opacity:0.12; }
          50%  { transform:translateX(3%)  scaleX(1.04); opacity:0.18; }
          100% { transform:translateX(-5%) scaleX(1); opacity:0.12; }
        }
      `}</style>
    </div>
  )
}

// ── THE CASTLE SCENE ──
function CastleScene({ isMobile }: { isMobile: boolean }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      width: '100vw',
      height: '100dvh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Dolly wrapper — animates the whole scene forward */}
      <div style={{
        position: 'absolute', inset: '-20%',
        animation: `${isMobile ? 'dollyMobile' : 'dolly'} 14s cubic-bezier(0.1,0,0.4,1) forwards`,
        transformStyle: 'preserve-3d',
      }}>
        <svg
          viewBox="0 0 1200 800"
          style={{ width: '100%', height: '100%' }}
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Background gradient — misty grey like LIMBO */}
            <radialGradient id="skyGrad" cx="50%" cy="40%">
              <stop offset="0%"   stopColor="#2a2a28" stopOpacity="1"/>
              <stop offset="60%"  stopColor="#141412" stopOpacity="1"/>
              <stop offset="100%" stopColor="#040404" stopOpacity="1"/>
            </radialGradient>

            {/* Stone texture filter */}
            <filter id="stone">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise"/>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
            </filter>

            {/* Glow for candles/lights */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>

            {/* Soft blur for background layers */}
            <filter id="bgBlur">
              <feGaussianBlur stdDeviation="3"/>
            </filter>

            {/* Vignette */}
            <radialGradient id="vig" cx="50%" cy="50%">
              <stop offset="30%"  stopColor="transparent"/>
              <stop offset="100%" stopColor="#010101"/>
            </radialGradient>

            {/* Fog gradient */}
            <linearGradient id="fogGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#1a1a18" stopOpacity="0"/>
              <stop offset="30%"  stopColor="#1a1a18" stopOpacity="0.15"/>
              <stop offset="70%"  stopColor="#1a1a18" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#1a1a18" stopOpacity="0"/>
            </linearGradient>

            <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#181816"/>
              <stop offset="100%" stopColor="#040404"/>
            </linearGradient>

            <linearGradient id="ceilingGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%"   stopColor="#1a1a18"/>
              <stop offset="100%" stopColor="#060606"/>
            </linearGradient>
          </defs>

          {/* ── SKY / BACKGROUND ── */}
          <rect width="1200" height="800" fill="url(#skyGrad)"/>

          {/* Far background — ruins/walls very blurred */}
          <g filter="url(#bgBlur)" opacity="0.4">
            {/* Distant arched windows */}
            <rect x="320" y="100" width="80" height="160" rx="40" fill="#0a0a0a"/>
            <rect x="800" y="120" width="80" height="140" rx="40" fill="#0a0a0a"/>
            <rect x="560" y="80"  width="60" height="180" rx="30" fill="#0c0c0a"/>
          </g>

          {/* ── CEILING ── */}
          <rect x="0" y="0" width="1200" height="220" fill="url(#ceilingGrad)"/>

          {/* Ceiling arch — the corridor */}
          <path
            d="M0,220 Q600,60 1200,220"
            fill="url(#ceilingGrad)" stroke="#111110" strokeWidth="2"
          />

          {/* Ceiling beams */}
          {[200, 400, 600, 800, 1000].map((x, i) => (
            <g key={i}>
              <rect x={x-12} y="0" width="24" height="240"
                fill="#0e0e0c" stroke="#181816" strokeWidth="1"
                filter="url(#stone)"
              />
              {/* Chain hanging from beam */}
              {i % 2 === 0 && (
                <g>
                  <line x1={x} y1="200" x2={x-8} y2="290"
                    stroke="#1a1a18" strokeWidth="1.5"/>
                  <line x1={x} y1="200" x2={x+8} y2="290"
                    stroke="#1a1a18" strokeWidth="1.5"/>
                  {/* Candle flame */}
                  <ellipse cx={x} cy="305" rx="6" ry="12"
                    fill="#c8882a" opacity="0.8"
                    style={{ animation: `candleFlicker ${1.2 + i*0.3}s ease-in-out infinite` }}
                  />
                  <ellipse cx={x} cy="316" rx="4" ry="4"
                    fill="#e8a030" opacity="0.9"
                    style={{ animation: `candleFlicker ${1.2 + i*0.3}s ease-in-out infinite` }}
                  />
                  {/* Candlelight glow */}
                  <ellipse cx={x} cy="310" rx="40" ry="40"
                    fill="#c87820" opacity="0.06" filter="url(#glow)"
                    style={{ animation: `flickerLight ${1.5 + i*0.2}s ease-in-out infinite` }}
                  />
                </g>
              )}
            </g>
          ))}

          {/* ── FLOOR ── */}
          <rect x="0" y="600" width="1200" height="200" fill="url(#floorGrad)"/>

          {/* Floor stone tiles perspective */}
          {[-2,-1,0,1,2,3,4,5].map((row, ri) => (
            [0,1,2,3,4,5,6,7,8].map((col, ci) => {
              const tileW = 120 + row * 40
              const tileH = 20 + row * 8
              const startX = 600 - (tileW * 4.5) + col * tileW
              const startY = 600 + row * 28
              return (
                <rect key={`${ri}-${ci}`}
                  x={startX} y={startY}
                  width={tileW - 2} height={tileH - 1}
                  fill="#0f0f0d" stroke="#1a1a18" strokeWidth="0.8"
                  opacity={0.6 + row * 0.05}
                />
              )
            })
          ))}

          {/* ── LEFT WALL ── */}
          <path
            d="M0,0 L340,220 L280,600 L0,800 Z"
            fill="#111110" stroke="#1a1a18" strokeWidth="1"
            filter="url(#stone)"
          />

          {/* Left wall — stone blocks */}
          {[0,1,2,3].map(row => (
            [0,1].map(col => (
              <rect key={`l-${row}-${col}`}
                x={col * 140 + row * 8}
                y={row * 140 + 220}
                width="136" height="88"
                fill="#0e0e0c" stroke="#181816" strokeWidth="1"
                filter="url(#stone)" opacity="0.7"
              />
            ))
          ))}

          {/* Left wall torch */}
          <g>
            <rect x="100" y="340" width="12" height="40" rx="3" fill="#1a1a16"/>
            <ellipse cx="106" cy="335" rx="8" ry="14"
              fill="#c8882a" opacity="0.85"
              style={{ animation: 'candleFlicker 1.1s ease-in-out infinite' }}
            />
            <ellipse cx="106" cy="348" rx="5" ry="5"
              fill="#e8a030" opacity="0.9"
              style={{ animation: 'candleFlicker 1.1s ease-in-out infinite' }}
            />
            <ellipse cx="106" cy="340" rx="60" ry="60"
              fill="#c87820" opacity="0.05" filter="url(#glow)"
              style={{ animation: 'flickerLight 1.3s ease-in-out infinite' }}
            />
          </g>

          {/* ── RIGHT WALL ── */}
          <path
            d="M1200,0 L860,220 L920,600 L1200,800 Z"
            fill="#111110" stroke="#1a1a18" strokeWidth="1"
            filter="url(#stone)"
          />

          {/* Right wall — stone blocks */}
          {[0,1,2,3].map(row => (
            [0,1].map(col => (
              <rect key={`r-${row}-${col}`}
                x={1060 - col * 140 - row * 8}
                y={row * 140 + 220}
                width="136" height="88"
                fill="#0e0e0c" stroke="#181816" strokeWidth="1"
                filter="url(#stone)" opacity="0.7"
              />
            ))
          ))}

          {/* Right wall torch */}
          <g>
            <rect x="1088" y="340" width="12" height="40" rx="3" fill="#1a1a16"/>
            <ellipse cx="1094" cy="335" rx="8" ry="14"
              fill="#c8882a" opacity="0.85"
              style={{ animation: 'candleFlicker 0.9s ease-in-out infinite' }}
            />
            <ellipse cx="1094" cy="348" rx="5" ry="5"
              fill="#e8a030" opacity="0.9"
              style={{ animation: 'candleFlicker 0.9s ease-in-out infinite' }}
            />
            <ellipse cx="1094" cy="340" rx="60" ry="60"
              fill="#c87820" opacity="0.05" filter="url(#glow)"
              style={{ animation: 'flickerLight 1.1s ease-in-out infinite' }}
            />
          </g>

          {/* ── STATUES — broken, on pedestals ── */}

          {/* Left statue */}
          <g opacity="0.8" filter="url(#stone)">
            {/* Pedestal */}
            <rect x="160" y="500" width="90" height="100" fill="#0d0d0b" stroke="#161614" strokeWidth="1"/>
            <rect x="152" y="492" width="106" height="16" fill="#111110" stroke="#161616" strokeWidth="1"/>
            {/* Body */}
            <rect x="190" y="380" width="30" height="114" fill="#0d0d0b" stroke="#161614" strokeWidth="1"/>
            {/* Head — broken off, tilted */}
            <ellipse cx="198" cy="368" rx="18" ry="20"
              fill="#0d0d0b" stroke="#161614" strokeWidth="1"
              transform="rotate(-25 198 368)"
            />
            {/* Broken arm on floor */}
            <rect x="145" y="490" width="55" height="12" rx="6"
              fill="#0d0d0b" stroke="#161614" strokeWidth="1"
              transform="rotate(-15 145 490)"
            />
            {/* Cracks */}
            <line x1="205" y1="400" x2="215" y2="440" stroke="#080808" strokeWidth="2"/>
            <line x1="215" y1="440" x2="208" y2="470" stroke="#080808" strokeWidth="1.5"/>
          </g>

          {/* Right statue */}
          <g opacity="0.8" filter="url(#stone)">
            <rect x="950" y="500" width="90" height="100" fill="#0d0d0b" stroke="#161614" strokeWidth="1"/>
            <rect x="942" y="492" width="106" height="16" fill="#111110" stroke="#161616" strokeWidth="1"/>
            <rect x="975" y="390" width="30" height="110" fill="#0d0d0b" stroke="#161614" strokeWidth="1"/>
            {/* Headless — just neck stump */}
            <rect x="982" y="382" width="16" height="12" rx="4"
              fill="#0d0d0b" stroke="#161614" strokeWidth="1"/>
            {/* Head on floor beside it */}
            <ellipse cx="940" cy="497" rx="20" ry="18"
              fill="#0d0d0b" stroke="#161614" strokeWidth="1"
              transform="rotate(30 940 497)"
            />
            <line x1="985" y1="420" x2="978" y2="460" stroke="#080808" strokeWidth="2"/>
          </g>

          {/* ── HANGING PAINTINGS on walls ── */}

          {/* Left painting */}
          <g>
            <rect x="58" y="230" width="110" height="140"
              fill="#080808" stroke="#222220" strokeWidth="3"
            />
            {/* Dark abstract inside painting */}
            <rect x="64" y="236" width="98" height="128" fill="#060606"/>
            <ellipse cx="113" cy="300" rx="30" ry="38"
              fill="none" stroke="#0e0e0c" strokeWidth="1.5" opacity="0.6"
            />
            <ellipse cx="113" cy="300" rx="12" ry="16"
              fill="#080808" stroke="#0c0c0a" strokeWidth="1"
            />
            {/* Frame corners */}
            <rect x="58" y="230" width="12" height="12" fill="#1a1a18"/>
            <rect x="156" y="230" width="12" height="12" fill="#1a1a18"/>
            <rect x="58" y="358" width="12" height="12" fill="#1a1a18"/>
            <rect x="156" y="358" width="12" height="12" fill="#1a1a18"/>
          </g>

          {/* Right painting */}
          <g>
            <rect x="1032" y="250" width="110" height="130"
              fill="#080808" stroke="#222220" strokeWidth="3"
            />
            <rect x="1038" y="256" width="98" height="118" fill="#060606"/>
            {/* Dark tree silhouette inside */}
            <line x1="1087" y1="370" x2="1087" y2="280" stroke="#0c0c0a" strokeWidth="8"/>
            <path d="M1087,290 Q1065,260 1048,268" fill="none" stroke="#0c0c0a" strokeWidth="4"/>
            <path d="M1087,310 Q1110,278 1128,286" fill="none" stroke="#0c0c0a" strokeWidth="4"/>
            <path d="M1087,330 Q1068,305 1055,310" fill="none" stroke="#0c0c0a" strokeWidth="3"/>
            <rect x="1032" y="250" width="12" height="12" fill="#1a1a18"/>
            <rect x="1130" y="250" width="12" height="12" fill="#1a1a18"/>
            <rect x="1032" y="368" width="12" height="12" fill="#1a1a18"/>
            <rect x="1130" y="368" width="12" height="12" fill="#1a1a18"/>
          </g>

          {/* ── END DOOR ── */}
          <g>
            {/* Door frame */}
            <rect x="490" y="240" width="220" height="340"
              fill="#060606" stroke="#1a1a18" strokeWidth="6"
              filter="url(#stone)"
            />
            {/* Door arch top */}
            <path d="M490,280 Q600,200 710,280"
              fill="#060606" stroke="#1a1a18" strokeWidth="6"
            />
            {/* Door panels */}
            <rect x="500" y="290" width="90" height="140"
              fill="#050505" stroke="#141412" strokeWidth="2"
            />
            <rect x="610" y="290" width="90" height="140"
              fill="#050505" stroke="#141412" strokeWidth="2"
            />
            <rect x="500" y="440" width="90" height="120"
              fill="#050505" stroke="#141412" strokeWidth="2"
            />
            <rect x="610" y="440" width="90" height="120"
              fill="#050505" stroke="#141412" strokeWidth="2"
            />
            {/* Door handles */}
            <circle cx="594" cy="420" r="8" fill="#1a1a18" stroke="#222" strokeWidth="1"/>
            <circle cx="606" cy="420" r="8" fill="#1a1a18" stroke="#222" strokeWidth="1"/>
            {/* Keyhole */}
            <circle cx="600" cy="418" r="4" fill="#020202"/>
            <rect x="597" y="418" width="6" height="8" fill="#020202"/>
            {/* Glow from behind door — light leaking */}
            <ellipse cx="600" cy="400" rx="80" ry="60"
              fill="#c8a060" opacity="0.04" filter="url(#glow)"
            />
          </g>

          {/* ── DUST PARTICLES ── */}
          {[
            { x:200, y:350, delay:'0s',  dur:'4s'  },
            { x:450, y:280, delay:'1.2s', dur:'5s'  },
            { x:700, y:400, delay:'0.5s', dur:'3.5s' },
            { x:900, y:300, delay:'2s',  dur:'4.5s' },
            { x:350, y:450, delay:'0.8s', dur:'3.8s' },
            { x:820, y:380, delay:'1.6s', dur:'4.2s' },
          ].map((p, i) => (
            <circle key={i}
              cx={p.x} cy={p.y} r="1.5"
              fill="#c8c8b8" opacity="0"
              style={{ animation: `dustFloat ${p.dur} ${p.delay} ease-in-out infinite` }}
            />
          ))}

          {/* ── FOG LAYER ── */}
          <rect x="0" y="480" width="1200" height="200"
            fill="url(#fogGrad)"
            style={{ animation: 'fogDrift 8s ease-in-out infinite' }}
          />
          <rect x="0" y="520" width="1200" height="160"
            fill="url(#fogGrad)" opacity="0.6"
            style={{ animation: 'fogDrift 12s ease-in-out infinite reverse' }}
          />

          {/* ── VIGNETTE OVERLAY ── */}
          <rect x="0" y="0" width="1200" height="800" fill="url(#vig)"/>

          {/* ── DARK CORNERS ── */}
          <rect x="0" y="0" width="200" height="800" fill="url(#ceilingGrad)" opacity="0.5"/>
          <rect x="1000" y="0" width="200" height="800" fill="url(#ceilingGrad)" opacity="0.5"/>
        </svg>

        {/* Dust particles overlay */}
        <DustCanvas />
      </div>
    </div>
  )
}

// ── DUST CANVAS ──
function DustCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let w = 0
    let h = 0
    let rafId: number

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    interface Dust { x:number; y:number; vy:number; vx:number; opacity:number; size:number }
    const dust: Dust[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -(Math.random() * 0.3 + 0.05),
      opacity: Math.random() * 0.3,
      size: Math.random() * 1.5 + 0.5,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      dust.forEach(d => {
        d.x += d.vx + Math.sin(Date.now() * 0.001 + d.y) * 0.1
        d.y += d.vy
        if (d.y < -5) { d.y = h + 5; d.x = Math.random() * w }
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,200,180,${d.opacity})`
        ctx.fill()
      })
      rafId = requestAnimationFrame(draw)
    }
    rafId = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 5,
    }}/>
  )
}
