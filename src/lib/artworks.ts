// ─────────────────────────────────────────────
// ARTWORK CONFIG
// Single source of truth. Each artwork picks how its modal art is rendered
// via the discriminated `media` union:
//   - { kind: 'svg' }                           → inline SVG component
//   - { kind: 'rive',  src: 'file.riv' }        → Rive animation in /public/rive/
//   - { kind: 'image', src: '/images/x.png' }   → static image (PNG, JPG, WEBP…)
// ─────────────────────────────────────────────

export type ArtworkMedia =
  | { kind: 'svg' }
  | { kind: 'rive'; src: string }
  | { kind: 'image'; src: string; alt?: string }

export interface Artwork {
  id: number
  title: string
  word: string
  cue: string
  // CSS values (e.g. 'clamp(320px, 70vmin, 760px)'). Strings let us scale
  // responsively across viewport sizes instead of using fixed pixel boxes.
  modalWidth: string
  modalHeight: string
  media: ArtworkMedia
}

// Reusable responsive sizes — keep things consistent across artworks.
const MODAL_SQUARE = 'clamp(320px, 70vmin, 760px)'
const MODAL_PORTRAIT_W = 'clamp(260px, 50vmin, 540px)'
const MODAL_PORTRAIT_H = 'clamp(380px, 75vmin, 800px)'

export const ARTWORKS: Artwork[] = [
  {
    id: 0,
    title: 'The Watcher',
    word: 'Accident',
    cue: 'It has been watching you since you arrived. Look at what it hides behind when it finally closes.',
    modalWidth: MODAL_SQUARE,
    modalHeight: MODAL_SQUARE,
    media: { kind: 'image', src: '/images/watcher.png', alt: 'The Watcher' },
  },
  {
    id: 1,
    title: 'The Forest',
    word: 'Exists',
    cue: 'The trees are not hiding it. The oldest one is. Look at its skin.',
    modalWidth: MODAL_PORTRAIT_W,
    modalHeight: MODAL_PORTRAIT_H,
    media: { kind: 'image', src: '/images/forest.png', alt: 'The Forest' },
  },
  {
    id: 2,
    title: 'The Machine',
    word: 'Ever',
    cue: 'Metal remembers everything. Time wrote something into it. Look at what the rust chose to become.',
    modalWidth: MODAL_SQUARE,
    modalHeight: MODAL_SQUARE,
    media: { kind: 'image', src: '/images/machine.png', alt: 'The Machine' },
  },
  {
    id: 3,
    title: 'The Child',
    word: 'By',
    cue: 'She carries it with her without knowing. It is written in what she wears.',
    modalWidth: MODAL_PORTRAIT_W,
    modalHeight: MODAL_PORTRAIT_H,
    media: { kind: 'image', src: '/images/child.png', alt: 'The Child' },
  },
  {
    id: 4,
    title: 'The Signal',
    word: 'Nothing',
    cue: 'The dial has been tuned many times. Look at the marks it left behind.',
    modalWidth: MODAL_SQUARE,
    modalHeight: MODAL_SQUARE,
    // Place the file at: public/images/signal.png  →  served at /images/signal.png
    media: { kind: 'image', src: '/images/signal.png', alt: 'The Signal' },
  },
]

// Carousel display order (visual order in carousel, not solve order)
export const CAROUSEL_ORDER = [4, 0, 2, 1, 3] // Signal, Watcher, Machine, Forest, Child

export const SECRET_PHRASE = 'NOTHING EVER EXISTS BY ACCIDENT'
export const EXCLUSIVE_URL = 'https://unlaunched.art/exclusive'
