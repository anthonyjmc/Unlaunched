# UNLAUNCHED — Rive Integration Guide

## How to swap an artwork SVG for a .riv file

### Step 1: Export your .riv from Rive
- File → Export → Download as .riv
- Put the file in `/public/rive/`
- Example: `/public/rive/watcher.riv`

### Step 2: Enable Rive in artworks.ts
Open `src/lib/artworks.ts` and set `useRive: true` for that artwork:

```ts
{
  id: 0,
  title: 'The Watcher',
  // ...
  useRive: true,        // ← change this
  rivSrc: 'watcher.riv',
}
```

That's it. The app will automatically load the .riv instead of the SVG.

---

## State Machine setup in Rive

Name your State Machine: **Main**

### Inputs by artwork:

#### THE WATCHER (watcher.riv)
- Input: `click` (Trigger) — fires when user clicks the eye
- Input: `xAxis` (Number, 0–100) — cursor X position
- Input: `yAxis` (Number, 0–100) — cursor Y position
- State: name it `solved` — app detects this state and calls onSolve()

#### THE FOREST (forest.riv)
- Input: `xAxis` (Number) — cursor X for tree movement
- Input: `centerDwell` (Boolean) — true when cursor is near center for 2s+
- State: name it `solved`

#### THE MACHINE (machine.riv)
- Input: `holdProgress` (Number, 0–100) — fill during hold
- Input: `released` (Boolean) — true when hold completes
- State: name it `solved`

#### THE CHILD (child.riv)
- Input: `isStill` (Boolean) — true when cursor hasn't moved for 3s
- State: name it `solved`

#### THE SIGNAL (signal.riv)
- Input: `circleDetected` (Boolean) — true when circle gesture detected
- State: name it `solved`

---

## How to swap the particles background

Open `src/components/backgrounds/ParticlesBackground.tsx`

At the bottom of the file there is a commented-out `RiveParticles` component.

1. Build your particle animation in Rive
2. Export as `particles.riv` → `/public/rive/particles.riv`
3. Uncomment `RiveParticles` at the bottom of ParticlesBackground.tsx
4. In `src/app/page.tsx`, replace:
   ```tsx
   import ParticlesBackground from '@/components/backgrounds/ParticlesBackground'
   ```
   with:
   ```tsx
   import { RiveParticles as ParticlesBackground } from '@/components/backgrounds/ParticlesBackground'
   ```

---

## Deploy to Vercel

```bash
npx vercel deploy
```

That's your submission URL.

---

## File structure

```
src/
├── app/
│   ├── globals.css          ← all CSS animations
│   ├── layout.tsx
│   └── page.tsx             ← main orchestrator
├── components/
│   ├── backgrounds/
│   │   ├── ParticlesBackground.tsx   ← swap with Rive particles
│   │   └── PerspectiveLines.tsx      ← perspective lines canvas
│   ├── gallery/
│   │   ├── ArtworkModal.tsx          ← SVG interactions + Rive loader
│   │   ├── ArtworkSVGs.tsx           ← all 5 SVG placeholders
│   │   ├── Carousel.tsx              ← 3D carousel logic
│   │   └── PhraseBar.tsx             ← secret phrase input
│   └── ui/
│       └── Cursor.tsx
└── lib/
    └── artworks.ts                   ← MAIN CONFIG: edit this to swap Rive
```
