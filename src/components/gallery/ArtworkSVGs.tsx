'use client'

// ─────────────────────────────────────────────
// SVG ARTWORK COMPONENTS
// These are placeholders until you have .riv files ready.
//
// TO SWAP EACH ONE WITH RIVE:
// 1. Set useRive: true in src/lib/artworks.ts for that artwork
// 2. The ArtworkRenderer component in ArtworkModal.tsx
//    will automatically load the .riv instead of this SVG.
// ─────────────────────────────────────────────

export function WatcherSVG({ size = 300 }: { size?: number }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 300 300">
      <rect width="300" height="300" fill="#030303"/>
      <g style={{ transformOrigin:'50% 50%', animation:'breathe 6s ease-in-out infinite' }}>
        <path d="M76,150 Q102,134 126,142" fill="none" stroke="#e0e0d8" strokeWidth="0.6"
          style={{ strokeDasharray:40, strokeDashoffset:40, animation:'vnFlow 5s ease-in-out infinite' }}/>
        <path d="M224,150 Q198,135 174,143" fill="none" stroke="#e0e0d8" strokeWidth="0.6"
          style={{ strokeDasharray:40, strokeDashoffset:40, animation:'vnFlow 5s 1.6s ease-in-out infinite' }}/>
        <ellipse cx="150" cy="150" rx="86" ry="44" fill="#080808" stroke="#141412" strokeWidth="0.8"/>
        <circle cx="150" cy="150" r="32" fill="#101010" stroke="#0c0c0a" strokeWidth="0.6"/>
        <g id="pupil-thumb" style={{ transition:'transform 0.07s ease-out' }}>
          <circle cx="150" cy="150" r="16" fill="#030303"/>
          <circle cx="155" cy="145" r="2" fill="white" opacity="0.08"/>
        </g>
        <circle cx="150" cy="150" r="32" fill="none" stroke="#050505" strokeWidth="4.5" opacity="0.98"/>
        <g id="lid-thumb" style={{ transformOrigin:'50% 50%', transform:'scaleY(0)', transition:'transform 0.5s ease' }}>
          <ellipse cx="150" cy="150" rx="86" ry="44" fill="#050505"/>
          <ellipse cx="150" cy="108" rx="86" ry="44" fill="#050505"/>
        </g>
        <path d="M64,150 Q150,108 236,150" fill="none" stroke="#161614" strokeWidth="1"/>
        <path d="M64,150 Q150,190 236,150" fill="none" stroke="#0e0e0c" strokeWidth="0.7"/>
      </g>
    </svg>
  )
}

export function ForestSVG() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 300">
      <rect width="200" height="300" fill="#020202"/>
      <circle cx="100" cy="34" r="18" fill="none" stroke="#141412" strokeWidth="0.4" opacity="0.3"/>
      <circle cx="107" cy="31" r="14" fill="#020202"/>
      <g>
        <polygon points="14,300 28,196 42,300"    fill="#050505" stroke="#0a0a0a" strokeWidth="0.3"/>
        <polygon points="8,300 24,170 40,300"     fill="#030303" stroke="#080808" strokeWidth="0.3"/>
        <polygon points="46,300 64,148 82,300"    fill="#060606" stroke="#0c0c0c" strokeWidth="0.3"/>
        <polygon points="72,300 94,126 116,300"   fill="#040404" stroke="#090909" strokeWidth="0.3"/>
        <polygon points="100,300 118,155 136,300" fill="#050505" stroke="#0b0b0b" strokeWidth="0.3"/>
        <polygon points="126,300 140,178 154,300" fill="#030303" stroke="#090909" strokeWidth="0.3"/>
        <polygon points="146,300 158,194 170,300" fill="#040404" stroke="#0a0a0a" strokeWidth="0.3"/>
      </g>
      <ellipse cx="100" cy="300" rx="105" ry="22" fill="#010101"/>
    </svg>
  )
}

export function MachineSVG() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 300 300">
      <rect width="300" height="300" fill="#040404"/>
      <g opacity="0.03" stroke="#e0e0d8" strokeWidth="0.4">
        <line x1="0" y1="75" x2="300" y2="75"/><line x1="0" y1="150" x2="300" y2="150"/>
        <line x1="0" y1="225" x2="300" y2="225"/><line x1="75" y1="0" x2="75" y2="300"/>
        <line x1="150" y1="0" x2="150" y2="300"/><line x1="225" y1="0" x2="225" y2="300"/>
      </g>
      <g style={{ transformBox:'fill-box', transformOrigin:'center', animation:'gCCW 2.6s linear infinite' }}>
        <circle cx="96" cy="150" r="40" fill="none" stroke="#161614" strokeWidth="11"/>
        <circle cx="96" cy="150" r="16" fill="#080808" stroke="#111110" strokeWidth="1"/>
        <rect x="91" y="106" width="10" height="18" fill="#141412" rx="1"/>
        <rect x="91" y="176" width="10" height="18" fill="#141412" rx="1"/>
        <rect x="52" y="145" width="18" height="10" fill="#141412" rx="1"/>
        <rect x="118" y="145" width="18" height="10" fill="#141412" rx="1"/>
      </g>
      <circle style={{ transformBox:'fill-box', transformOrigin:'center', animation:'gb 2s ease-in-out infinite' }}
        cx="96" cy="150" r="48" fill="none" stroke="#e0e0d8" strokeWidth="0.5" opacity="0.12"/>
      <g style={{ transformBox:'fill-box', transformOrigin:'center', animation:'gCW 3.2s linear infinite' }}>
        <circle cx="204" cy="150" r="30" fill="none" stroke="#111110" strokeWidth="8"/>
        <circle cx="204" cy="150" r="12" fill="#060606" stroke="#0c0c0a" strokeWidth="0.8"/>
        <rect x="198" y="116" width="12" height="16" fill="#0e0e0c" rx="1"/>
        <rect x="198" y="168" width="12" height="16" fill="#0e0e0c" rx="1"/>
        <rect x="168" y="144" width="16" height="12" fill="#0e0e0c" rx="1"/>
        <rect x="216" y="144" width="16" height="12" fill="#0e0e0c" rx="1"/>
      </g>
      <rect x="134" y="145" width="22" height="10" fill="#0a0a08" stroke="#111110" strokeWidth="0.3"/>
    </svg>
  )
}

export function ChildSVG() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 300">
      <rect width="200" height="300" fill="#020202"/>
      <line x1="0" y1="272" x2="200" y2="272" stroke="#0c0c0c" strokeWidth="0.4"/>
      <ellipse cx="100" cy="279" rx="32" ry="7" fill="#030303"/>
      <g style={{
        transform: 'translateY(36px) scale(0.44)',
        transformOrigin: '100px 230px',
        transformBox: 'fill-box',
      }}>
        <ellipse cx="100" cy="192" rx="13" ry="16" fill="#0b0b0b" stroke="#121210" strokeWidth="0.4"/>
        <rect x="92" y="207" width="16" height="52" fill="#0b0b0b" stroke="#121210" strokeWidth="0.4" rx="2"/>
        <rect x="74" y="212" width="16" height="36" fill="#090909" stroke="#0f0f0d" strokeWidth="0.4" rx="2"/>
        <rect x="110" y="212" width="16" height="36" fill="#090909" stroke="#0f0f0d" strokeWidth="0.4" rx="2"/>
        <rect x="84" y="259" width="13" height="18" fill="#0b0b0b" stroke="#121210" strokeWidth="0.4" rx="2"/>
        <rect x="101" y="259" width="13" height="18" fill="#0b0b0b" stroke="#121210" strokeWidth="0.4" rx="2"/>
      </g>
    </svg>
  )
}

export function SignalSVG() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 300 300">
      <rect width="300" height="300" fill="#030303"/>
      <g style={{ animation:'ss 0.08s steps(1) infinite' }}>
        <line x1="0" y1="22"  x2="300" y2="22"  stroke="#e0e0d8" strokeWidth="1.0"/>
        <line x1="0" y1="42"  x2="300" y2="42"  stroke="#e0e0d8" strokeWidth="0.5"/>
        <line x1="0" y1="60"  x2="300" y2="60"  strokeWidth="1.1" stroke="#e0e0d8"/>
        <line x1="0" y1="78"  x2="300" y2="78"  stroke="#e0e0d8" strokeWidth="0.6"/>
        <line x1="0" y1="98"  x2="300" y2="98"  stroke="#e0e0d8" strokeWidth="0.9"/>
        <line x1="0" y1="118" x2="300" y2="118" stroke="#e0e0d8" strokeWidth="0.5"/>
        <line x1="0" y1="138" x2="300" y2="138" stroke="#e0e0d8" strokeWidth="1.0"/>
        <line x1="0" y1="158" x2="300" y2="158" stroke="#e0e0d8" strokeWidth="0.7"/>
        <line x1="0" y1="178" x2="300" y2="178" stroke="#e0e0d8" strokeWidth="0.5"/>
        <line x1="0" y1="198" x2="300" y2="198" stroke="#e0e0d8" strokeWidth="1.0"/>
        <line x1="0" y1="218" x2="300" y2="218" stroke="#e0e0d8" strokeWidth="0.6"/>
        <line x1="0" y1="238" x2="300" y2="238" stroke="#e0e0d8" strokeWidth="0.8"/>
        <line x1="0" y1="258" x2="300" y2="258" stroke="#e0e0d8" strokeWidth="0.5"/>
        <line x1="0" y1="278" x2="300" y2="278" stroke="#e0e0d8" strokeWidth="0.9"/>
      </g>
    </svg>
  )
}

// Map artwork id → thumbnail SVG component
export const ARTWORK_THUMBS: Record<number, React.FC> = {
  0: WatcherSVG,
  1: ForestSVG,
  2: MachineSVG,
  3: ChildSVG,
  4: SignalSVG,
}
