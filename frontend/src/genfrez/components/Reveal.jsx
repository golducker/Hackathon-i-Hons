import { useContext, useEffect, useRef, useState } from 'react'
import { ScrollRootContext } from '../contexts'

const canObserve = typeof window !== 'undefined' && 'IntersectionObserver' in window

// Hiện dần phần tử khi cuộn tới (fade + trượt nhẹ), chỉ chạy một lần. `delay` dùng
// để so le các phần tử trong cùng một nhóm. `variant`: up | left | right | pop.
export default function Reveal({ as: Tag = 'div', delay = 0, variant = 'up', className = '', style, children, ...rest }) {
  const ref = useRef(null)
  const rootRef = useContext(ScrollRootContext)
  const [shown, setShown] = useState(!canObserve)

  useEffect(() => {
    const el = ref.current
    if (!el || !canObserve) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { root: rootRef?.current ?? null, threshold: 0.1, rootMargin: '0px 0px -4% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootRef])

  return (
    <Tag
      ref={ref}
      className={`gf-reveal gf-reveal-${variant}${shown ? ' gf-revealed' : ''} ${className}`}
      style={{ ...style, '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
