'use client'

import { useState } from 'react'
import { SECRET_PHRASE, EXCLUSIVE_URL } from '@/lib/artworks'

interface Props {
  visible: boolean
  onUnlock: () => void
}

export default function PhraseBar({ visible, onUnlock }: Props) {
  const [value, setValue]     = useState('')
  const [feedback, setFeedback] = useState('')
  const [isError, setIsError]  = useState(false)

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
      height:104,
      display:'flex', alignItems:'center', justifyContent:'center',
      gap:24,
      background:'linear-gradient(to top, rgba(8,8,8,1) 70%, transparent)',
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? 'auto' : 'none',
      transition:'opacity 0.5s ease',
    }}>
      <div style={{
        fontSize:14, letterSpacing:'0.22em',
        color:'var(--dim)', textTransform:'uppercase', flexShrink:0,
      }}>
        Secret phrase
      </div>

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
          fontWeight:300, fontSize:20, letterSpacing:'0.06em',
          padding:'10px 0', width:'clamp(280px,38vw,460px)',
          outline:'none', cursor:'none', caretColor:'var(--white)',
          textAlign:'center', transition:'border-color 0.3s',
        }}
      />

      <button
        onClick={check}
        style={{
          fontFamily:'Inter, sans-serif', fontSize:14, fontWeight:400,
          letterSpacing:'0.22em', textTransform:'uppercase',
          color:'var(--light)', background:'transparent',
          border:'1px solid var(--border2)', padding:'12px 26px',
          cursor:'none', transition:'border-color 0.2s, color 0.2s',
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

      {feedback && (
        <div style={{
          position:'absolute', bottom:10, left:'50%',
          transform:'translateX(-50%)',
          fontSize:13, letterSpacing:'0.2em',
          color: isError ? 'rgba(180,60,40,0.8)' : 'var(--dim)',
          textTransform:'uppercase', whiteSpace:'nowrap', pointerEvents:'none',
        }}>
          {feedback}
        </div>
      )}
    </div>
  )
}
