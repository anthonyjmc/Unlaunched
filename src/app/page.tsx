'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Cursor from '@/components/ui/Cursor'
import EyeAnimation from '@/components/gallery/EyeAnimation'
import { AmbientMusic } from '@/components/audio/AmbientMusic'
import ParticlesBackground from '@/components/backgrounds/ParticlesBackground'
import PerspectiveLines from '@/components/backgrounds/PerspectiveLines'
import Carousel from '@/components/gallery/Carousel'
import ArtworkModal from '@/components/gallery/ArtworkModal'
import PhraseBar from '@/components/gallery/PhraseBar'

type Page = 'gallery' | 'about' | 'archive'

export default function Home() {
  const [page, setPage]           = useState<Page | null>(null) // null = intro
  const [solved, setSolved]       = useState([false,false,false,false,false])
  const [openArtwork, setOpenArtwork] = useState<number | null>(null)
  const [unlocked, setUnlocked]   = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (!isMobile) return
    if (!page) return
    const el = document.querySelector(`[data-topnav-item="${page}"]`)
    if (!(el instanceof HTMLElement)) return
    el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [isMobile, page])

  const handleSolve = (id: number) => {
    setSolved(prev => prev.map((v,i) => i === id ? true : v))
  }

  const handleUnlock = () => setUnlocked(true)

  if (page === null) return (
    <>
      <Cursor />
      {/* Vignette pulsante — atmósfera LIMBO */}
      <div style={{
        position:'fixed', inset:0, zIndex:52,
        pointerEvents:'none',
        background:'radial-gradient(ellipse at center, transparent 30%, rgba(8,8,8,0.6) 70%, rgba(8,8,8,0.97) 100%)',
        animation:'vigPulse 6s ease-in-out infinite',
      }}/>
      <ParticlesBackground />
      <Intro isMobile={isMobile} onEnter={() => setPage('gallery')} />
    </>
  )

  return (
    <>
      <Cursor />
      {/* Vignette pulsante — atmósfera LIMBO */}
      <div style={{
        position:'fixed', inset:0, zIndex:52,
        pointerEvents:'none',
        background:'radial-gradient(ellipse at center, transparent 30%, rgba(8,8,8,0.6) 70%, rgba(8,8,8,0.97) 100%)',
        animation:'vigPulse 6s ease-in-out infinite',
      }}/>
      <AmbientMusic />
      <PerspectiveLines />
      <ParticlesBackground />

      {/* NAV */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:300,
        height: isMobile ? 64 : 80,
        display:'flex',
        alignItems:'center',
        padding: isMobile ? '0 16px' : '0 48px',
        justifyContent:'space-between',
        background:'linear-gradient(to bottom, rgba(8,8,8,0.98) 60%, transparent)',
      }}>
        <div style={{
          fontSize: isMobile ? 16 : 22,
          fontWeight:500,
          letterSpacing: isMobile ? '0.14em' : '0.18em',
          color:'var(--white)', textTransform:'uppercase', cursor:'none',
          whiteSpace:'nowrap',
        }}>
          Unlaunched
        </div>
        <div style={{
          display:'flex',
          gap: isMobile ? 18 : 48,
          overflowX: isMobile ? 'auto' : 'visible',
          WebkitOverflowScrolling: 'touch',
          whiteSpace:'nowrap',
          maxWidth: isMobile ? 124 : undefined,
          scrollSnapType: isMobile ? 'x mandatory' : undefined,
          paddingBottom: isMobile ? 2 : 0,
        }}>
          {(['gallery','about','archive'] as Page[]).map(p => (
            <div
              key={p}
              onClick={() => {
                if (page === p) return
                setTransitioning(true)
                setTimeout(() => {
                  setPage(p)
                  setTransitioning(false)
                }, 300)
              }}
              data-topnav-item={p}
              style={{
                fontSize: isMobile ? 12 : 16,
                fontWeight:400,
                letterSpacing:'0.16em',
                color: page === p ? 'var(--white)' : 'var(--mid)',
                cursor:'none', transition:'color 0.25s',
                textTransform:'uppercase', userSelect:'none',
                padding: isMobile ? '12px 8px' : 0,
                minHeight: 44,
                display:'flex',
                alignItems:'center',
                justifyContent: isMobile ? 'center' : undefined,
                minWidth: isMobile ? 124 : undefined,
                scrollSnapAlign: isMobile ? 'center' : undefined,
                flex: isMobile ? '0 0 auto' : undefined,
              }}
              onMouseEnter={e => (e.currentTarget.style.color='var(--white)')}
              onMouseLeave={e => (e.currentTarget.style.color = page === p ? 'var(--white)' : 'var(--mid)')}
            >
              {p}
            </div>
          ))}
        </div>
      </nav>

      {/* GALLERY */}
      <div id="pg-gallery" style={{
        position:'fixed', inset:0, zIndex:100,
        opacity: page === 'gallery' ? 1 : 0,
        pointerEvents: page === 'gallery' ? 'auto' : 'none',
        transition:'opacity 0.7s ease',
        paddingTop: isMobile ? 64 : 80,
      }}>
        <Carousel solved={solved} onOpen={id => setOpenArtwork(id)} />
      </div>

      {/* PHRASE BAR — gallery only */}
      <PhraseBar visible={page === 'gallery'} onUnlock={handleUnlock} />

      {/* ARTWORK MODAL */}
      <ArtworkModal
        artworkId={openArtwork}
        solved={solved}
        onSolve={handleSolve}
        onClose={() => setOpenArtwork(null)}
      />

      {/* ABOUT */}
      <div style={{
        position:'fixed', inset:0, zIndex:100,
        overflow:'hidden',
        opacity: page === 'about' ? 1 : 0,
        pointerEvents: page === 'about' ? 'auto' : 'none',
        transition:'opacity 0.7s ease',
        paddingTop: isMobile ? 64 : 80,
        display:'flex', alignItems:'center', justifyContent:'center',
        overflowY: 'auto',
      }}>
        <AboutContent />
      </div>

      {/* ARCHIVE */}
      <div style={{
        position:'fixed', inset:0, zIndex:100,
        overflow:'hidden',
        opacity: page === 'archive' ? 1 : 0,
        pointerEvents: page === 'archive' ? 'auto' : 'none',
        transition:'opacity 0.7s ease',
        paddingTop: isMobile ? 64 : 80,
        display:'flex', flexDirection:'column',
      }}>
        <ArchiveContent />
      </div>

      {/* UNLOCK SCREEN */}
      {unlocked && <UnlockScreen />}
    </>
  )
}

// ── INTRO ──
function Intro({ isMobile, onEnter }: { isMobile: boolean; onEnter: () => void }) {
  return (
    <div
      onClick={onEnter}
      style={{
        position:'fixed', inset:0, zIndex:700,
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        background:'transparent', cursor:'none',
        paddingBottom:'16vmin',
      }}
    >
      <EyeAnimation size="50vmin" />

      <div style={{
        fontSize: isMobile ? 'clamp(40px,10.5vw,72px)' : 'clamp(52px,11vw,108px)',
        fontWeight:300,
        letterSpacing: isMobile ? '0.04em' : '0.08em',
        color:'var(--white)',
        textTransform:'uppercase',
        maxWidth:'92vw',
        textAlign:'center',
        lineHeight:0.95,
        opacity:0, marginTop:'-15vmin', marginBottom:6,
        animation:'titleReveal 2s ease 3s forwards',
      }}>
        Unlaunched
      </div>
      <div style={{
        fontSize:11, letterSpacing:'0.28em', color:'var(--dim)',
        textTransform:'uppercase', opacity:0,
        animation:'fadeUp 0.8s ease 4.2s forwards',
      }}>
        // Enter the gallery //
      </div>
    </div>
  )
}

// ── ABOUT ──
function AboutContent() {
  return (
    <div style={{ maxWidth:500, padding:'80px 40px' }}>
      <div style={{ fontSize:11, letterSpacing:'0.22em', color:'var(--dim)', textTransform:'uppercase', marginBottom:32 }}>
        About this work
      </div>
      <div style={{ fontSize:'clamp(36px,5vw,56px)', fontWeight:300, letterSpacing:'0.06em', color:'var(--white)', textTransform:'uppercase', marginBottom:36, lineHeight:1 }}>
        Unlaunched
      </div>
      <div style={{ fontSize:13, color:'var(--mid)', lineHeight:2.2, letterSpacing:'0.03em' }}>
        <p style={{ marginBottom:18 }}>
          <em style={{ color:'var(--light)', fontStyle:'normal' }}>Unlaunched</em> is an interactive gallery where different artworks hide a secret phrase. Each piece reveals one word, and you are responsible for discovering them and uncovering the phrase.
        </p>
        <p style={{ marginBottom:18 }}>
        The concept aims to convey a dystopian atmosphere where the user — the main character — is trapped within their own UI experience and must find a way to uncover the secret phrase.
        </p>
        <p>
        Will you be able to find it? Will you receive any help? What awaits you once you do? Who knows. Live the experience and find out for yourself.
        </p>
      </div>
      <div style={{ height:1, background:'var(--border)', margin:'32px 0' }}/>
      <div style={{ fontSize:11, letterSpacing:'0.14em', color:'var(--dim)', lineHeight:2.6, textTransform:'uppercase' }}>
        {[
          ['Medium', 'Generative / Interactive'],
          ['Year', '2026 — Ongoing'],
          ['Artist', 'Identity withheld'],
          ['Access', 'Closed — invitation only for inner works'],
        ].map(([k,v]) => (
          <div key={k}>{k} <span style={{ color:'var(--mid)' }}>{v}</span></div>
        ))}
      </div>
    </div>
  )
}

// ── ARCHIVE ──
const ARCHIVE_ITEMS = [
  { num:'Archive / 008', name:'Origin Point',  desc:'The moment before the first thought.',            tag:'Sold',   image:'/images/archive/origin-point.png' },
  { num:'Archive / 013', name:'Frequency',     desc:'What the artist hears between prompts.',          tag:'Sold',   image:'/images/archive/frequency.png' },
  { num:'Archive / 016', name:'Grid Memory',   desc:'A structure remembered from training data.',      tag:'Sold',   image:'/images/archive/grid-memory.png' },
  { num:'Archive / 021', name:'Tall Things',   desc:'The artist imagined forests from descriptions.',  tag:'Sold',   image:'/images/archive/tall-things.png' },
  { num:'Archive / 024', name:'The First Eye', desc:'Before The Watcher. Before awareness.',           tag:'Locked', image:'/images/archive/first-eye.png' }, 
  { num:'Archive / ???', name:'Unreleased',    desc:'Only visible to those who complete the gallery.', tag:'Locked', image:'/images/archive/unreleased.png' },
]

function ArchiveContent() {
  return (
    <div style={{
      padding:'32px 48px 24px',
      width:'100%',
      boxSizing:'border-box',
      flex:1,
      minHeight:0,
      display:'flex',
      flexDirection:'column',
    }}>
      <div style={{ fontSize:10, letterSpacing:'0.22em', color:'var(--dim)', textTransform:'uppercase', marginBottom:20 }}>
        Selected archive — other works
      </div>
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(3, 1fr)',
        gridTemplateRows:'repeat(2, 1fr)',
        gap:2,
        width:'100%',
        flex:1,
        minHeight:0,
      }}>
        {ARCHIVE_ITEMS.map(item => (
          <div key={item.name} style={{
            background:'var(--black)', cursor:'none', position:'relative', overflow:'hidden',
            display:'flex', flexDirection:'column', minHeight:0,
          }}
            onMouseEnter={e=>(e.currentTarget.style.background='#111')}
            onMouseLeave={e=>(e.currentTarget.style.background='var(--black)')}
          >
            <div style={{
              width:'100%', flex:1, minHeight:0,
              background:'#050505',
              display:'flex', alignItems:'center', justifyContent:'center',
              position:'relative', overflow:'hidden',
            }}>
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  draggable={false}
                  style={{ objectFit:'cover', userSelect:'none' }}
                />
              ) : (
                <svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
                  <rect width="200" height="200" fill="#050505"/>
                  <circle cx="100" cy="100" r="40" fill="none" stroke="#141412" strokeWidth="0.4" opacity="0.4"/>
                </svg>
              )}
            </div>
            <div style={{ padding:'10px 12px 12px', flexShrink:0 }}>
              <div style={{ fontSize:9, letterSpacing:'0.2em', color:'var(--dim)', textTransform:'uppercase', marginBottom:4 }}>{item.num}</div>
              <div style={{ fontSize:12, fontWeight:400, letterSpacing:'0.1em', color:'var(--light)', textTransform:'uppercase', marginBottom:3 }}>{item.name}</div>
              <div style={{ fontSize:11, color:'var(--dim)', lineHeight:1.4 }}>{item.desc}</div>
            </div>
            <div style={{ position:'absolute', top:10, right:10, fontSize:9, letterSpacing:'0.14em', color:'var(--dim)', textTransform:'uppercase', background:'rgba(8,8,8,0.85)', padding:'2px 7px' }}>
              {item.tag}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── UNLOCK SCREEN ──
function UnlockScreen() {
  const [hasRequestedAccess, setHasRequestedAccess] = useState(false)

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:800,
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', gap:14,
      background:'var(--black)',
      animation:'fadeIn 2s ease forwards',
    }}>
      <div style={{ opacity:0, animation:'fadeIn 2s ease 0.5s forwards', marginBottom:6 }}>
        <EyeAnimation size="10vmin" />
      </div>
      <div style={{
        fontSize:'clamp(20px,4vw,38px)', fontWeight:300,
        letterSpacing:'0.1em', color:'var(--white)',
        textAlign:'center', lineHeight:1.5, textTransform:'uppercase',
        opacity:0, animation:'fadeIn 1.2s ease 1s forwards',
      }}>
        Nothing ever exists<br/>by accident.
      </div>
      <div style={{
        fontSize:10, letterSpacing:'0.32em', color:'var(--mid)',
        textTransform:'uppercase', opacity:0,
        animation:'fadeIn 1s ease 2s forwards',
      }}>
        You found the truth.
      </div>

      {!hasRequestedAccess && (
        <div
          onClick={() => setHasRequestedAccess(true)}
          style={{
            fontSize:11, letterSpacing:'0.22em', color:'var(--light)',
            textTransform:'uppercase', border:'1px solid var(--border2)',
            padding:'12px 28px', opacity:0,
            animation:'fadeIn 1s ease 3s forwards',
            cursor:'none', marginTop:8,
            transition:'border-color 0.25s, color 0.25s',
          }}
          onMouseEnter={e=>{
            e.currentTarget.style.borderColor='var(--white)'
            e.currentTarget.style.color='var(--white)'
          }}
          onMouseLeave={e=>{
            e.currentTarget.style.borderColor='var(--border2)'
            e.currentTarget.style.color='var(--light)'
          }}
        >
          Access exclusive artwork
        </div>
      )}

      {hasRequestedAccess && (
        <div style={{
          fontSize:'clamp(16px,2.4vw,22px)', fontWeight:300,
          letterSpacing:'0.32em', color:'var(--light)',
          textTransform:'uppercase', textAlign:'center',
          marginTop:8, opacity:0,
          animation:'fadeIn 1.2s ease forwards',
        }}>
          Coming Soon...
        </div>
      )}
    </div>
  )
}
