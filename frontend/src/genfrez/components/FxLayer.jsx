import { useCallback, useMemo, useRef, useState } from 'react'
import { FxContext } from '../contexts'

// Lớp hiệu ứng nổi trên toàn khung điện thoại: confetti hình lá cây/giấy màu bung ra
// từ đúng nút vừa bấm + dòng "+1.000" bay lên. Gọi qua useFx().burst(element, opts)
// (contexts.js) ngay trong onClick — toạ độ và hướng bay của từng hạt được random ở
// đây (lúc bấm), không random trong lúc render, nên component vẫn thuần.

const PALETTES = {
  green: ['#2fa66b', '#4ee08a', '#a9de6a', '#f26a1b', '#ffd45a', '#ffffff'],
  orange: ['#f26a1b', '#ffd45a', '#e8785c', '#2a93ad', '#f2a6c9', '#ffffff'],
}
const SHAPES = ['leaf', 'leaf', 'rect', 'dot', 'rect']

let burstSeq = 0

export function FxProvider({ frameRef, children }) {
  const [bursts, setBursts] = useState([])
  const timers = useRef(new Set())

  const burst = useCallback(
    (target, { text, count = 28, palette = 'green', spread = 1 } = {}) => {
      const frame = frameRef.current
      if (!frame) return
      const fr = frame.getBoundingClientRect()
      let x = fr.width / 2
      let y = fr.height / 2
      if (target?.getBoundingClientRect) {
        const r = target.getBoundingClientRect()
        x = r.left + r.width / 2 - fr.left
        y = r.top + r.height / 2 - fr.top
      }
      const colors = PALETTES[palette] ?? PALETTES.green
      const particles = Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5
        const dist = (70 + Math.random() * 90) * spread
        return {
          shape: SHAPES[i % SHAPES.length],
          color: colors[i % colors.length],
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist * 0.85 - 40,
          rot: Math.round(Math.random() * 720 - 360),
          delay: Math.round(Math.random() * 90),
          size: 0.7 + Math.random() * 0.6,
        }
      })
      burstSeq += 1
      const id = burstSeq
      setBursts((list) => [...list, { id, x, y, text, particles }])
      const timer = setTimeout(() => {
        timers.current.delete(timer)
        setBursts((list) => list.filter((b) => b.id !== id))
      }, 1700)
      timers.current.add(timer)
    },
    [frameRef]
  )

  const api = useMemo(() => ({ burst }), [burst])

  return (
    <FxContext.Provider value={api}>
      {children}
      <div className="gf-fx-layer" aria-hidden="true">
        {bursts.map((b) => (
          <div key={b.id} className="gf-fx-burst" style={{ left: b.x, top: b.y }}>
            <span className="gf-fx-ring" />
            {b.particles.map((p, i) => (
              <span
                key={i}
                className={`gf-fx-particle gf-fx-${p.shape}`}
                style={{
                  '--dx': `${p.dx}px`,
                  '--dy': `${p.dy}px`,
                  '--rot': `${p.rot}deg`,
                  '--c': p.color,
                  '--d': `${p.delay}ms`,
                  '--s': p.size,
                }}
              />
            ))}
            {b.text && <span className="gf-fx-text">{b.text}</span>}
          </div>
        ))}
      </div>
    </FxContext.Provider>
  )
}
