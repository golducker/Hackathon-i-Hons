import { createContext, useContext } from 'react'

// Tách khỏi file component để Vite fast-refresh hoạt động (file component chỉ nên
// export component).

// Vùng cuộn thật của app là div .gf-phone-scroll trong PhoneFrame (không phải
// window), nên IntersectionObserver của Reveal phải lấy đúng div đó làm root.
export const ScrollRootContext = createContext(null)

// Lớp hiệu ứng confetti/số điểm bay — xem FxLayer.jsx.
export const FxContext = createContext({ burst: () => {} })

export function useFx() {
  return useContext(FxContext)
}
