'use client'
import { useEffect, useRef } from 'react'

export default function PerspectiveLines() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let w = 0, h = 0, vx = 0, vy = 0
    let mx = window.innerWidth / 2, my = window.innerHeight / 2
    let animId: number

    const resize = () => {
      w = canvas.width  = window.innerWidth
      h = canvas.height = window.innerHeight
      vx = w / 2; vy = h / 2
    }
    resize()
    window.addEventListener('resize', resize)
    const onMouse = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }
    window.addEventListener('mousemove', onMouse)

    const getEdgePoints = () => {
      const pts: {x:number,y:number}[] = []
      for (let i=0;i<9;i++) pts.push({x:w*i/8, y:0})
      for (let i=0;i<9;i++) pts.push({x:w*i/8, y:h})
      for (let i=1;i<8;i++) pts.push({x:0, y:h*i/8})
      for (let i=1;i<8;i++) pts.push({x:w, y:h*i/8})
      return pts
    }

    const draw = (ts: number) => {
      ctx.clearRect(0, 0, w, h)
      vx += (w/2 + (mx-w/2)*0.06 - vx) * 0.015
      vy += (h/2 + (my-h/2)*0.06 - vy) * 0.015
      getEdgePoints().forEach((p, i) => {
        const phase = (ts * 0.00025 + i * 0.11) % 1
        ctx.beginPath()
        ctx.moveTo(vx, vy)
        ctx.lineTo(p.x, p.y)
        const grad = ctx.createLinearGradient(vx, vy, p.x, p.y)
        grad.addColorStop(0,   'rgba(230,228,220,0)')
        grad.addColorStop(0.25,'rgba(230,228,220,0)')
        grad.addColorStop(Math.min(0.25+phase*0.7,0.9),'rgba(230,228,220,0.05)')
        grad.addColorStop(1,   'rgba(230,228,220,0.015)')
        ctx.strokeStyle = grad
        ctx.lineWidth = 0.4
        ctx.setLineDash([3, 18])
        ctx.lineDashOffset = -phase * 21
        ctx.stroke()
      })
      ctx.setLineDash([])
      animId = requestAnimationFrame(draw)
    }
    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        zIndex: 50, pointerEvents: 'none',
      }}
    />
  )
}
