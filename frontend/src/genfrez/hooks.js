import { useEffect, useRef, useState } from 'react'

// Giá trị hiển thị gần nhất của từng bộ đếm, sống ngoài component — để quay lại tab
// Home không đếm lại từ 0 mỗi lần (chỉ lần đầu mở app mới đếm từ 0), còn khi điểm
// đổi thì chạy tiếp từ số cũ sang số mới.
const lastShown = new Map()

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Số "chạy" từ giá trị cũ tới giá trị mới (ease-out), dùng cho điểm, km, thống kê.
export function useCountUp(value, { key, duration = 1000 } = {}) {
  const [display, setDisplay] = useState(() => (prefersReducedMotion() ? value : (lastShown.get(key) ?? 0)))
  const currentRef = useRef(display)

  useEffect(() => {
    const from = currentRef.current
    if (from === value) return undefined
    if (prefersReducedMotion()) {
      currentRef.current = value
      if (key) lastShown.set(key, value)
      setDisplay(value)
      return undefined
    }
    let raf = 0
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const v = t === 1 ? value : from + (value - from) * eased
      currentRef.current = v
      if (key) lastShown.set(key, v)
      setDisplay(v)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration, key])

  return display
}
