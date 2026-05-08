'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useRive, useStateMachineInput } from '@rive-app/react-canvas'
import { ARTWORKS } from '@/lib/artworks'
import type { Artwork } from '@/lib/artworks'

interface Props {
  artworkId: number | null
  solved: boolean[]
  onSolve: (id: number) => void
  onClose: () => void
}

export default function ArtworkModal({ artworkId, solved, onSolve, onClose }: Props) {
  const isOpen = artworkId !== null
  const artwork = artworkId !== null ? ARTWORKS[artworkId] : null
  const isSolved = artworkId !== null ? solved[artworkId] : false

  if (!isOpen || !artwork) return null

  return (
    <div
      style={{
        position:'fixed', inset:0, zIndex:500,
        display:'flex', alignItems:'center', justifyContent:'center',
        background:'rgba(8,8,8,0.96)',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        transition:'opacity 0.5s ease',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:18, position:'relative' }}>

        {/* Close */}
        <div
          onClick={onClose}
          style={{
            position:'absolute', top:-36, right:0,
            fontSize:10, letterSpacing:'0.2em',
            color:'var(--mid)', textTransform:'uppercase',
            cursor:'none', transition:'color 0.2s',
          }}
          onMouseEnter={e=>(e.currentTarget.style.color='var(--white)')}
          onMouseLeave={e=>(e.currentTarget.style.color='var(--mid)')}
        >
          [ Close ]
        </div>

        {/* Title */}
        <div style={{ fontSize:10, letterSpacing:'0.28em', color:'var(--dim)', textTransform:'uppercase' }}>
          {artwork.title}
        </div>

        {/* Art — SVG, Rive or static image */}
        <div style={{
          width: artwork.modalWidth, height: artwork.modalHeight,
          border:'1px solid var(--border2)', background:'#040404',
          position:'relative', overflow:'hidden',
        }}>
          {artwork.media.kind === 'rive' && (
            <RiveArtwork artwork={artwork} onSolve={() => onSolve(artwork.id)} isSolved={isSolved}/>
          )}
          {artwork.media.kind === 'image' && (
            <ImageArtwork
              src={artwork.media.src}
              alt={artwork.media.alt ?? artwork.title}
              onSolve={() => onSolve(artwork.id)}
              isSolved={isSolved}
            />
          )}
          {artwork.media.kind === 'svg' && (
            <SVGArtwork artwork={artwork} onSolve={() => onSolve(artwork.id)} isSolved={isSolved}/>
          )}
        </div>

        {/* Cue / solved */}
        {!isSolved && (
          <div style={{
            fontSize:11, letterSpacing:'0.2em', color:'var(--mid)',
            textTransform:'uppercase', textAlign:'center',
            animation:'dimP 3s ease-in-out infinite',
          }}>
            {artwork.cue}
          </div>
        )}
        {isSolved && (
          <div style={{ fontSize:11, letterSpacing:'0.2em', color:'var(--white)', textTransform:'uppercase' }}>
            Word revealed — return to the gallery.
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// RIVE ARTWORK
// Loaded when artwork.useRive === true
// ─────────────────────────────────────────────
function RiveArtwork({ artwork, onSolve, isSolved }: {
  artwork: Artwork
  onSolve: () => void
  isSolved: boolean
}) {
  const riveSrc = artwork.media.kind === 'rive' ? `/rive/${artwork.media.src}` : ''
  const { rive, RiveComponent } = useRive({
    src: riveSrc,
    stateMachines: 'Main',   // name your state machine 'Main' in Rive
    autoplay: true,
  })

  // ── WATCHER: trigger on click ──
  const clickTrigger = useStateMachineInput(rive, 'Main', 'click')

  // ── WATCHER / FOREST / CHILD: cursor position ──
  const xAxis = useStateMachineInput(rive, 'Main', 'xAxis')
  const yAxis = useStateMachineInput(rive, 'Main', 'yAxis')

  // ── MACHINE: hold progress ──
  const holdProgress = useStateMachineInput(rive, 'Main', 'holdProgress')

  // ── SIGNAL: circle detected ──
  const circleDetected = useStateMachineInput(rive, 'Main', 'circleDetected')

  // ── GENERIC: solved state ──
  const solvedInput = useStateMachineInput(rive, 'Main', 'solved')

  // Listen for Rive events
  useEffect(() => {
    if (!rive) return
    rive.on('statechange' as any, (event: any) => {
      // When Rive enters a state named 'solved', call onSolve
      if (event?.data?.includes?.('solved') && !isSolved) {
        onSolve()
      }
    })
  }, [rive, onSolve, isSolved])

  return (
    <div style={{ width:'100%', height:'100%' }}>
      <RiveComponent style={{ width:'100%', height:'100%' }} />
      {/*
        Connect your inputs here based on the artwork.
        Example for The Watcher:
          <div onClick={() => clickTrigger?.fire()} style={{position:'absolute',inset:0}}/>

        Example cursor tracking (add to useEffect with mousemove):
          xAxis.value = (e.clientX / window.innerWidth)  * 100
          yAxis.value = (e.clientY / window.innerHeight) * 100

        See RIVE_GUIDE.md for full connection instructions.
      */}
    </div>
  )
}

// ─────────────────────────────────────────────
// IMAGE ARTWORK
// Renders a static image (PNG/JPG/WEBP) from /public, covering the full frame.
// Default interaction: click to solve (only once).
// ─────────────────────────────────────────────
// Non-interactive: just renders the image, full-cover, no click handler.
// `onSolve` and `isSolved` are kept in the signature so the dispatch in the
// modal can pass them uniformly across media kinds without conditionals.
function ImageArtwork({ src, alt }: {
  src: string
  alt: string
  onSolve: () => void
  isSolved: boolean
}) {
  return (
    <div style={{
      width:'100%', height:'100%',
      position:'relative',
    }}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 90vw, 420px"
        priority
        draggable={false}
        style={{ objectFit:'cover', userSelect:'none', pointerEvents:'none' }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────
// SVG ARTWORK (placeholder while building Rive)
// Inline SVG with JS interactions
// ─────────────────────────────────────────────
function SVGArtwork({ artwork, onSolve, isSolved }: {
  artwork: Artwork
  onSolve: () => void
  isSolved: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mx, setMx] = useState(0)
  const [my, setMy] = useState(0)

  useEffect(() => {
    const move = (e: MouseEvent) => { setMx(e.clientX); setMy(e.clientY) }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  switch (artwork.id) {
    case 0: return <WatcherModal mx={mx} my={my} onSolve={onSolve} isSolved={isSolved}/>
    case 1: return <ForestModal  mx={mx} my={my} onSolve={onSolve} isSolved={isSolved}/>
    case 2: return <MachineModal mx={mx} my={my} onSolve={onSolve} isSolved={isSolved}/>
    case 3: return <ChildModal   mx={mx} my={my} onSolve={onSolve} isSolved={isSolved}/>
    case 4: return <SignalModal  mx={mx} my={my} onSolve={onSolve} isSolved={isSolved}/>
    default: return null
  }
}

// ── WATCHER MODAL ──
function WatcherModal({ mx, my, onSolve, isSolved }: any) {
  const artRef = useRef<SVGSVGElement>(null)
  const [shut, setShut] = useState(false)
  const [pupilX, setPupilX] = useState(0)
  const [pupilY, setPupilY] = useState(0)

  useEffect(() => {
    if (!artRef.current) return
    const r = artRef.current.getBoundingClientRect()
    const dx = mx - (r.left + r.width  / 2)
    const dy = my - (r.top  + r.height / 2)
    const d  = Math.sqrt(dx*dx + dy*dy) || 1
    setPupilX((dx/d) * 12 * Math.min(d, 180) / 180)
    setPupilY((dy/d) * 12 * Math.min(d, 180) / 180)
  }, [mx, my])

  const handleClick = () => {
    if (isSolved || shut) return
    setShut(true)
    setTimeout(onSolve, 700)
  }

  return (
    <svg ref={artRef} width="100%" height="100%" viewBox="0 0 380 380" onClick={handleClick}>
      <rect width="380" height="380" fill="#030303"/>
      <g style={{ transformOrigin:'50% 50%', animation:'breathe 6s ease-in-out infinite' }}>
        <path d="M94,190 Q126,170 156,180" fill="none" stroke="#e0e0d8" strokeWidth="0.7"
          style={{ strokeDasharray:40, strokeDashoffset:40, animation:'vnFlow 5s ease-in-out infinite' }}/>
        <path d="M286,190 Q254,171 224,181" fill="none" stroke="#e0e0d8" strokeWidth="0.7"
          style={{ strokeDasharray:40, strokeDashoffset:40, animation:'vnFlow 5s 1.6s ease-in-out infinite' }}/>
        <ellipse cx="190" cy="190" rx="110" ry="57" fill="#080808" stroke="#141412" strokeWidth="0.8"/>
        <circle cx="190" cy="190" r="42" fill="#101010" stroke="#0c0c0a" strokeWidth="0.6"/>
        <g style={{ transform:`translate(${pupilX}px,${pupilY}px)`, transition:'transform 0.07s ease-out' }}>
          <circle cx="190" cy="190" r="21" fill="#030303"/>
          <circle cx="196" cy="184" r="3" fill="white" opacity="0.08"/>
        </g>
        <circle cx="190" cy="190" r="42" fill="none" stroke="#050505" strokeWidth="6" opacity="0.98"/>
        <g style={{
          transformOrigin:'50% 50%',
          transform: shut ? 'scaleY(1)' : 'scaleY(0)',
          transition:'transform 0.5s ease',
        }}>
          <ellipse cx="190" cy="190" rx="110" ry="57" fill="#050505"/>
          <ellipse cx="190" cy="135" rx="110" ry="57" fill="#050505"/>
        </g>
        <path d="M80,190 Q190,135 300,190" fill="none" stroke="#161614" strokeWidth="1.2"/>
        <path d="M80,190 Q190,243 300,190" fill="none" stroke="#0e0e0c" strokeWidth="0.8"/>
      </g>
    </svg>
  )
}

// ── FOREST MODAL ──
function ForestModal({ mx, my, onSolve, isSolved }: any) {
  const artRef = useRef<SVGSVGElement>(null)
  const [treeShift, setTreeShift] = useState(0)
  const [figOpacity, setFigOpacity] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const doneRef = useRef(false)

  useEffect(() => {
    if (!artRef.current || doneRef.current) return
    const r = artRef.current.getBoundingClientRect()
    setTreeShift((mx - r.left) / r.width - 0.5)
    const cx = r.left + r.width/2, cy = r.top + r.height/2
    const dist = Math.sqrt((mx-cx)**2 + (my-cy)**2)
    const inside = mx>r.left && mx<r.right && my>r.top && my<r.bottom
    if (inside && dist < 90) {
      if (!timerRef.current) timerRef.current = setTimeout(() => {
        if (doneRef.current) return
        setFigOpacity(0.65)
        setTimeout(() => { doneRef.current = true; onSolve() }, 2000)
      }, 2400)
    } else {
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
    }
  }, [mx, my, onSolve])

  const trees = [0,1,2,3,4,5,6]
  return (
    <svg ref={artRef} width="100%" height="100%" viewBox="0 0 280 420">
      <rect width="280" height="420" fill="#020202"/>
      <circle cx="140" cy="56" r="24" fill="none" stroke="#141412" strokeWidth="0.4" opacity="0.3"/>
      <circle cx="149" cy="52" r="20" fill="#020202"/>
      {[
        "20,420 40,274 60,420","11,420 32,240 53,420","62,420 88,208 114,420",
        "100,420 130,180 160,420","144,420 168,226 192,420",
        "180,420 198,252 216,420","206,420 220,272 234,420"
      ].map((pts, i) => (
        <polygon key={i} points={pts}
          fill={['#050505','#030303','#060606','#040404','#050505','#030303','#040404'][i]}
          stroke={['#0a0a0a','#080808','#0c0c0c','#090909','#0b0b0b','#090909','#0a0a0a'][i]}
          strokeWidth="0.3"
          style={{ transform:`translateX(${(i%2===0?1:-1)*treeShift*20}px)` }}
        />
      ))}
      <ellipse cx="140" cy="420" rx="146" ry="30" fill="#010101"/>
      <g style={{ opacity: figOpacity, transition:'opacity 2s ease' }}>
        <ellipse cx="140" cy="344" rx="12" ry="14" fill="#0c0c0c" stroke="#141412" strokeWidth="0.4"/>
        <rect x="129" y="357" width="22" height="52" fill="#0c0c0c" stroke="#141412" strokeWidth="0.4" rx="1"/>
      </g>
    </svg>
  )
}

// ── MACHINE MODAL ──
function MachineModal({ mx, my, onSolve, isSolved }: any) {
  const [held, setHeld] = useState(false)
  const [stopped, setStopped] = useState(false)
  const holdRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pctRef  = useRef(0)
  const doneRef = useRef(false)

  const startHold = () => {
    if (doneRef.current) return
    pctRef.current = 0
    holdRef.current = setInterval(() => {
      pctRef.current += 2
      if (pctRef.current >= 100) {
        clearInterval(holdRef.current!)
        holdRef.current = null
        doneRef.current = true
        setStopped(true)
        setTimeout(onSolve, 500)
      }
    }, 28)
  }

  const stopHold = () => {
    if (holdRef.current) { clearInterval(holdRef.current); holdRef.current = null }
    pctRef.current = 0
  }

  return (
    <svg width="100%" height="100%" viewBox="0 0 380 380"
      onMouseDown={startHold} onMouseUp={stopHold} onMouseLeave={stopHold}>
      <rect width="380" height="380" fill="#040404"/>
      <g style={{ transformBox:'fill-box', transformOrigin:'120px 190px',
        animation: stopped ? 'none' : 'gCCW 2.6s linear infinite' }}>
        <circle cx="120" cy="190" r="56" fill="none" stroke="#161614" strokeWidth="14"/>
        <circle cx="120" cy="190" r="22" fill="#080808" stroke="#111110" strokeWidth="1"/>
        <rect x="113" y="128" width="14" height="24" fill="#141412" rx="1"/>
        <rect x="113" y="228" width="14" height="24" fill="#141412" rx="1"/>
        <rect x="58"  y="183" width="24" height="14" fill="#141412" rx="1"/>
        <rect x="154" y="183" width="24" height="14" fill="#141412" rx="1"/>
      </g>
      <circle style={{ transformBox:'fill-box', transformOrigin:'center',
        animation:'gb 2s ease-in-out infinite' }}
        cx="120" cy="190" r="67" fill="none" stroke="#e0e0d8" strokeWidth="0.6" opacity="0.12"/>
      <g style={{ transformBox:'fill-box', transformOrigin:'260px 190px',
        animation: stopped ? 'none' : 'gCW 3.2s linear infinite' }}>
        <circle cx="260" cy="190" r="42" fill="none" stroke="#111110" strokeWidth="11"/>
        <circle cx="260" cy="190" r="17" fill="#060606" stroke="#0c0c0a" strokeWidth="1"/>
        <rect x="253" y="143" width="14" height="20" fill="#0e0e0c" rx="1"/>
        <rect x="253" y="217" width="14" height="20" fill="#0e0e0c" rx="1"/>
        <rect x="213" y="183" width="20" height="14" fill="#0e0e0c" rx="1"/>
        <rect x="273" y="183" width="20" height="14" fill="#0e0e0c" rx="1"/>
      </g>
      <rect x="174" y="183" width="28" height="14" fill="#0a0a08" stroke="#111110" strokeWidth="0.3"/>
    </svg>
  )
}

// ── CHILD MODAL ──
function ChildModal({ mx, my, onSolve, isSolved }: any) {
  const [childScale, setChildScale] = useState(0.42)
  const [childY, setChildY] = useState(52)
  const [wordOpacity, setWordOpacity] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const doneRef  = useRef(false)

  useEffect(() => {
    if (doneRef.current) return
    if (timerRef.current) clearTimeout(timerRef.current)
    setChildScale(0.42); setChildY(52)
    timerRef.current = setTimeout(() => {
      if (doneRef.current) return
      setChildScale(1); setChildY(0)
      setTimeout(() => {
        if (doneRef.current) return
        setWordOpacity(0.5)
        setTimeout(() => { doneRef.current = true; onSolve() }, 1800)
      }, 4000)
    }, 3200)
  }, [mx, my, onSolve])

  return (
    <svg width="100%" height="100%" viewBox="0 0 280 420">
      <rect width="280" height="420" fill="#020202"/>
      <line x1="0" y1="386" x2="280" y2="386" stroke="#0c0c0c" strokeWidth="0.4"/>
      <ellipse cx="140" cy="394" rx="44" ry="9" fill="#030303"/>
      <g style={{
        transform:`translateY(${childY}px) scale(${childScale})`,
        transformOrigin:'140px 330px', transformBox:'fill-box',
        transition:'transform 4s ease',
      }}>
        <ellipse cx="140" cy="278" rx="18" ry="21" fill="#0b0b0b" stroke="#121210" strokeWidth="0.5"/>
        <rect x="128" y="298" width="24" height="74" fill="#0b0b0b" stroke="#121210" strokeWidth="0.5" rx="2"/>
        <rect x="104" y="304" width="22" height="50" fill="#090909" stroke="#0f0f0d" strokeWidth="0.4" rx="2"/>
        <rect x="154" y="304" width="22" height="50" fill="#090909" stroke="#0f0f0d" strokeWidth="0.4" rx="2"/>
        <rect x="120" y="372" width="18" height="26" fill="#0b0b0b" stroke="#121210" strokeWidth="0.5" rx="2"/>
        <rect x="142" y="372" width="18" height="26" fill="#0b0b0b" stroke="#121210" strokeWidth="0.5" rx="2"/>
      </g>
      <text x="140" y="140" textAnchor="middle"
        fontFamily="'Inter',sans-serif" fontWeight="300" fontSize="14"
        fill="#e0e0d8" letterSpacing="6"
        style={{ opacity: wordOpacity, transition:'opacity 1.6s ease' }}>
        by
      </text>
    </svg>
  )
}

// ── SIGNAL MODAL ──
function SignalModal({ mx, my, onSolve, isSolved }: any) {
  const artRef  = useRef<SVGSVGElement>(null)
  const ptsRef  = useRef<{x:number,y:number,t:number}[]>([])
  const doneRef = useRef(false)
  const [figOn, setFigOn]     = useState(false)
  const [ringR, setRingR]     = useState(0)
  const [ringOp, setRingOp]   = useState(0)

  useEffect(() => {
    if (doneRef.current || !artRef.current) return
    const r = artRef.current.getBoundingClientRect()
    if (mx < r.left || mx > r.right || my < r.top || my > r.bottom) return
    ptsRef.current.push({ x: mx-r.left, y: my-r.top, t: Date.now() })
    ptsRef.current = ptsRef.current.filter(p => Date.now()-p.t < 2400)
    if (ptsRef.current.length > 25 && isCircle(ptsRef.current)) {
      doneRef.current = true
      ptsRef.current = []
      setRingR(80); setRingOp(0.25)
      setTimeout(() => {
        setRingR(120); setRingOp(0.08)
        setFigOn(true)
        setTimeout(onSolve, 1800)
      }, 700)
    }
  }, [mx, my, onSolve])

  return (
    <svg ref={artRef} width="100%" height="100%" viewBox="0 0 380 380">
      <rect width="380" height="380" fill="#030303"/>
      <g style={{ animation:'ss 0.08s steps(1) infinite' }}>
        {[28,52,74,96,120,144,168,192,216,240,264,288,312,336].map((y,i) => (
          <line key={y} x1="0" y1={y} x2="380" y2={y} stroke="#e0e0d8"
            strokeWidth={[1.1,0.5,1.2,0.6,0.9,0.5,1.1,0.8,0.5,1.0,0.6,0.8,0.5,0.9][i]}/>
        ))}
      </g>
      <g style={{ opacity: figOn ? 0.65 : 0, transition:'opacity 1.4s ease' }}>
        <ellipse cx="190" cy="142" rx="28" ry="32" fill="none" stroke="#e0e0d8" strokeWidth="0.8" opacity="0.55"/>
        <rect x="166" y="172" width="48" height="84" fill="none" stroke="#e0e0d8" strokeWidth="0.7" opacity="0.45" rx="2"/>
        <rect x="122" y="180" width="42" height="62" fill="none" stroke="#e0e0d8" strokeWidth="0.5" opacity="0.35" rx="2"/>
        <rect x="216" y="180" width="42" height="62" fill="none" stroke="#e0e0d8" strokeWidth="0.5" opacity="0.35" rx="2"/>
        <text x="190" y="292" textAnchor="middle"
          fontFamily="'Inter',sans-serif" fontWeight="300" fontSize="14"
          fill="#e0e0d8" letterSpacing="4" opacity="0.75">accident</text>
      </g>
      <circle cx="190" cy="190" r={ringR} fill="none" stroke="#e0e0d8" strokeWidth="0.5"
        style={{ opacity: ringOp, transition:'r 0.7s ease, opacity 0.7s ease' }}/>
    </svg>
  )
}

function isCircle(pts: {x:number,y:number,t:number}[]) {
  const cx = pts.reduce((s,p)=>s+p.x,0)/pts.length
  const cy = pts.reduce((s,p)=>s+p.y,0)/pts.length
  const ds = pts.map(p=>Math.sqrt((p.x-cx)**2+(p.y-cy)**2))
  const avg = ds.reduce((a,b)=>a+b)/ds.length
  const v   = ds.reduce((s,d)=>s+(d-avg)**2,0)/ds.length
  const angs = pts.map(p=>Math.atan2(p.y-cy,p.x-cx))
  return avg>24 && avg<140 && Math.sqrt(v)<34 && (Math.max(...angs)-Math.min(...angs))>4.4
}
