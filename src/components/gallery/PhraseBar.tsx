'use client'

import { useEffect, useState } from 'react'
import { SECRET_PHRASE } from '@/lib/artworks'

interface Props {
  visible: boolean
  onUnlock: () => void
}

export default function PhraseBar({ visible, onUnlock }: Props) {
  const [value, setValue]     = useState('')
  const [feedback, setFeedback] = useState('')
  const [isError, setIsError]  = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const check = () => {
    if (!value.trim()) {
      setFeedback('Type something.')
      setIsError(false)
      return
    }
    if (value.trim().toUpperCase() === SECRET_PHRASE) {
      setFeedback('')
      onUnlock()
    } else {
      setFeedback('Is this the right order?')
      setIsError(true)
      setTimeout(() => setIsError(false), 1400)
    }
  }

  return (
    
    <div style={{
      position:'fixed', bottom:0, left:0, right:0, zIndex:200,
      height: isMobile ? 156 : 104,
      display:'flex', alignItems:'center', justifyContent:'center',
      gap: isMobile ? 12 : 24,
      background:'linear-gradient(to top, rgba(8,8,8,1) 70%, transparent)',
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? 'auto' : 'none',
      transition:'opacity 0.5s ease',
      paddingBottom:'env(safe-area-inset-bottom)',
    }}>
      {/* Separador superior */}
      <div style={{
        position:'absolute', top:0, left:'10%', right:'10%',
        height:'0px',
        background:'linear-gradient(to right, transparent, rgba(240,240,236,0.12), transparent)',
      }}/>
      <div style={{
        width:'min(960px, 92vw)',
        display:'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent:'center',
        gap: isMobile ? 12 : 24,
      }}>
        <div style={{
          fontSize: isMobile ? 12 : 14,
          letterSpacing:'0.22em',
          color:'var(--dim)',
          textTransform:'uppercase',
          flexShrink:0,
          textAlign: isMobile ? 'center' : 'left',
        }}>
          Secret phrase
        </div>

        <div style={{
          display:'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems:'center',
          justifyContent:'center',
          gap: isMobile ? 10 : 16,
          width:'100%',
        }}>
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && check()}
            placeholder="What have you found?"
            autoComplete="off"
            spellCheck={false}
            style={{
              background:'transparent', border:'none',
              borderBottom: isError
                ? '1px solid rgba(180,60,40,0.4)'
                : '1px solid var(--border2)',
              color:'var(--white)', fontFamily:'Inter, sans-serif',
              fontWeight:300,
              fontSize: isMobile ? 16 : 20,
              letterSpacing:'0.06em',
              padding:'10px 0',
              width: isMobile ? '100%' : 'clamp(280px,38vw,460px)',
              maxWidth: isMobile ? 560 : undefined,
              outline:'none', cursor:'none', caretColor:'var(--white)',
              textAlign:'center', transition:'border-color 0.3s',
            }}
          />

          <button
            onClick={check}
            style={{
              fontFamily:'Inter, sans-serif',
              fontSize: isMobile ? 12 : 14,
              fontWeight:400,
              letterSpacing:'0.22em',
              textTransform:'uppercase',
              color:'var(--light)',
              background:'transparent',
              border:'1px solid var(--border2)',
              padding: isMobile ? '12px 18px' : '12px 26px',
              cursor:'none',
              transition:'border-color 0.2s, color 0.2s',
              width: isMobile ? '100%' : undefined,
              maxWidth: isMobile ? 260 : undefined,
              alignSelf: isMobile ? 'center' : undefined,
              minHeight: 44,
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
            Submit
          </button>
        </div>
      </div>

      {feedback && (
        <div style={{
          position:'absolute', bottom: isMobile ? 8 : 10, left:'50%',
          transform:'translateX(-50%)',
          fontSize: isMobile ? 11 : 13,
          letterSpacing:'0.2em',
          color: isError ? 'rgba(180,60,40,0.8)' : 'var(--dim)',
          textTransform:'uppercase', whiteSpace:'nowrap', pointerEvents:'none',
          width:'92vw',
          textAlign:'center',
        }}>
          {feedback}
        </div>
      )}
    </div>
  )
}
