'use client'

// ─────────────────────────────────────────────
// PARTICLES BACKGROUND (Rive)
// Fullscreen, fit: cover, pointer-events disabled on the wrapper so the UI
// stays clickable. We forward global window mouse events to the canvas via
// dispatchEvent so Rive's pointer listeners (pointerMove / pointerExit) still
// receive the cursor position.
// Source: /public/rive/particles.riv
// ─────────────────────────────────────────────

import { useEffect, useRef } from 'react'
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas'

export default function ParticlesBackground() {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const { rive, RiveComponent } = useRive({
    src: '/rive/particles.riv',
    autoplay: true,
    stateMachines: 'State Machine 1',
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
  })

  // Keep the drawing surface in sync with the canvas size on resize
  // (avoids blurry rendering on viewport / DPR changes).
  useEffect(() => {
    if (!rive) return
    const onResize = () => rive.resizeDrawingSurfaceToCanvas()
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [rive])

  // Forward global mouse events to the canvas. The wrapper has
  // pointer-events: none so other UI keeps receiving native clicks; the
  // synthetic events we dispatch here still trigger Rive's internal listeners.
  useEffect(() => {
    if (!rive) return
    const canvas = wrapperRef.current?.querySelector('canvas')
    if (!canvas) return

    const dispatch = (type: string, e: MouseEvent) => {
      const evt = new PointerEvent(type, {
        clientX: e.clientX,
        clientY: e.clientY,
        bubbles: true,
        pointerType: 'mouse',
      })
      canvas.dispatchEvent(evt)
    }

    const onMove  = (e: MouseEvent) => dispatch('pointermove', e)
    const onLeave = (e: MouseEvent) => dispatch('pointerout',  e)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout',  onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout',  onLeave)
    }
  }, [rive])

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 51,
        pointerEvents: 'none',
      }}
    >
      <RiveComponent style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
