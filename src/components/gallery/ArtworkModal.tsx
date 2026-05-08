'use client'

import Image from 'next/image'
import { ARTWORKS } from '@/lib/artworks'

interface Props {
  artworkId: number | null
  solved: boolean[]
  onSolve: (id: number) => void
  onClose: () => void
}

export default function ArtworkModal({ artworkId, solved, onClose }: Props) {
  if (artworkId === null) return null
  const artwork = ARTWORKS[artworkId]
  if (!artwork) return null
  const isSolved = solved[artworkId]

  return (
    <div
      style={{
        position:'fixed', inset:0, zIndex:500,
        display:'flex', alignItems:'center', justifyContent:'center',
        background:'rgba(8,8,8,0.96)',
        transition:'opacity 0.5s ease',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:18, position:'relative' }}>

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

        <div style={{ fontSize:10, letterSpacing:'0.28em', color:'var(--dim)', textTransform:'uppercase' }}>
          {artwork.title}
        </div>

        <div style={{
          width: artwork.modalWidth, height: artwork.modalHeight,
          border:'1px solid var(--border2)', background:'#040404',
          position:'relative', overflow:'hidden',
        }}>
          <Image
            src={artwork.src}
            alt={artwork.alt}
            fill
            sizes="(max-width: 768px) 90vw, 420px"
            priority
            draggable={false}
            style={{ objectFit:'cover', userSelect:'none', pointerEvents:'none' }}
          />
        </div>

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
