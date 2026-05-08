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
    // [DEBUG] remove once verified
    console.log('[Rive][debug] canvas found:', !!canvas, canvas)
    console.log('[Rive][debug] rive.contents:', rive.contents)
    if (!canvas) return

    // [DEBUG] sniff what reaches the canvas natively (will log only if
    // pointer-events: none is bypassed somehow). Useful as a control.
    const sniff = (e: Event) => console.log('[Rive][debug] canvas got:', e.type)
    canvas.addEventListener('pointermove', sniff)

    let dispatchCount = 0
    const dispatch = (type: string, e: MouseEvent) => {
      const evt = new PointerEvent(type, {
        clientX: e.clientX,
        clientY: e.clientY,
        bubbles: true,
        pointerType: 'mouse',
      })
      const ok = canvas.dispatchEvent(evt)
      // [DEBUG] only log first ~3 to avoid console spam
      if (dispatchCount < 3) {
        console.log('[Rive][debug] dispatched', type, { x: e.clientX, y: e.clientY, ok })
        dispatchCount++
      }
    }

    const onMove  = (e: MouseEvent) => dispatch('pointermove', e)
    const onLeave = (e: MouseEvent) => dispatch('pointerout',  e)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout',  onLeave)
    return () => {
      canvas.removeEventListener('pointermove', sniff)
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
