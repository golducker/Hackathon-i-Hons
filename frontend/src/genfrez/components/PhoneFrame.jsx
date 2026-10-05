import { useEffect, useRef } from 'react'
import StatusBar from './StatusBar'
import Mascot from './Mascot'
import { FxProvider } from './FxLayer'
import { ScrollRootContext } from '../contexts'

// Lá cây trôi lơ lửng phía sau khung điện thoại — vị trí/tốc độ cố định (không
// random lúc render) để mỗi lần render ra đúng một cảnh.
const LEAVES = [
  { x: '6%', d: '17s', delay: '-2s', s: 1 },
  { x: '14%', d: '23s', delay: '-11s', s: 0.7 },
  { x: '24%', d: '19s', delay: '-6s', s: 0.85 },
  { x: '76%', d: '21s', delay: '-4s', s: 0.9 },
  { x: '85%', d: '16s', delay: '-9s', s: 0.65 },
  { x: '93%', d: '25s', delay: '-15s', s: 1.1 },
]

function AmbientBackground() {
  return (
    <div className="gf-ambient" aria-hidden="true">
      <span className="gf-blob gf-blob-1" />
      <span className="gf-blob gf-blob-2" />
      <span className="gf-blob gf-blob-3" />
      {LEAVES.map((leaf, i) => (
        <span
          key={i}
          className="gf-ambient-leaf"
          style={{ '--x': leaf.x, '--d': leaf.d, '--delay': leaf.delay, '--s': leaf.s }}
        />
      ))}
      {/* Linh vật đứng hai bên khung điện thoại — chỉ hiện trên màn hình rộng (demo
          bằng laptop/máy chiếu), ẩn trên điện thoại thật. */}
      <Mascot name="heart-hug" className="gf-ambient-mascot gf-ambient-mascot-1" />
      <Mascot name="yellow-tongue" className="gf-ambient-mascot gf-ambient-mascot-2" />
      <Mascot name="blue-wave" className="gf-ambient-mascot gf-ambient-mascot-3" />
      <Mascot name="square-wave" className="gf-ambient-mascot gf-ambient-mascot-4" />
    </div>
  )
}

export default function PhoneFrame({ children, nav, overlay, screenKey }) {
  const frameRef = useRef(null)
  const scrollRef = useRef(null)

  // Ghi vị trí cuộn ra CSS variable trên khung (--sy: px đã cuộn, --sp: 0→1 tiến độ)
  // để CSS tự làm parallax + thanh tiến độ, không phải re-render React mỗi lần cuộn.
  useEffect(() => {
    const el = scrollRef.current
    const frame = frameRef.current
    if (!el || !frame) return undefined
    let raf = 0
    const update = () => {
      raf = 0
      const max = el.scrollHeight - el.clientHeight
      frame.style.setProperty('--sy', String(Math.round(el.scrollTop)))
      frame.style.setProperty('--sp', max > 0 ? (el.scrollTop / max).toFixed(4) : '0')
      frame.toggleAttribute('data-scrolled', el.scrollTop > 8)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Đổi màn → cuộn về đầu (trước đây vùng cuộn dùng chung nên đổi tab vẫn giữ vị trí
  // cuộn của tab cũ).
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = 0
    el.dispatchEvent(new Event('scroll'))
  }, [screenKey])

  return (
    <div className="gf-page-outer">
      <AmbientBackground />
      <div className="gf-phone-frame" ref={frameRef}>
        <FxProvider frameRef={frameRef}>
          <StatusBar />
          <ScrollRootContext.Provider value={scrollRef}>
            <div className="gf-phone-scroll" ref={scrollRef}>
              <div key={screenKey} className="gf-screen-enter">
                {children}
              </div>
            </div>
          </ScrollRootContext.Provider>
          {nav}
          {overlay}
        </FxProvider>
      </div>
    </div>
  )
}
