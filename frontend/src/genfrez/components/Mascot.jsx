import { useState } from 'react'

// Linh vật lấy thẳng từ bộ PNG chính thức (frontend/public/mascots — cắt từ brand
// sheet "Mascot Kit", nền trong suốt, giữ nguyên pixel gốc). Thay cho 8 bản vẽ tay
// SVG trước đây. Mỗi linh vật có một kiểu chuyển động "idle" hợp tính cách (tim đập,
// loa hô hào, sao lắc lư...) — xem @keyframes gf-idle-* trong genfrez-fx.css.
// Ảnh gốc chỉ cao ~100-130px, nên giữ kích thước hiển thị ≤ 2x để không bị vỡ nét.
const MASCOTS = {
  'fluffy-scared': { w: 92, h: 114, alt: 'Pink fluffy mascot', idle: 'jiggle' },
  megaphone: { w: 108, h: 128, alt: 'Orange mascot shouting into a megaphone', idle: 'shout' },
  'blue-wave': { w: 110, h: 114, alt: 'Blue star mascot waving', idle: 'sway' },
  'star-cool': { w: 125, h: 116, alt: 'Pink star mascot wearing sunglasses', idle: 'groove' },
  'green-kiss': { w: 169, h: 129, alt: 'Green mascot blowing a kiss', idle: 'bob' },
  eyes: { w: 122, h: 102, alt: 'Pair of looking eyes', idle: 'look' },
  'yellow-tongue': { w: 135, h: 115, alt: 'Yellow mascot sticking its tongue out', idle: 'hop' },
  'heart-hug': { w: 112, h: 127, alt: 'Orange heart mascot hugging itself', idle: 'beat' },
  'square-wave': { w: 156, h: 130, alt: 'Pink square mascot waving', idle: 'sway' },
}

export default function Mascot({ name, className = '', idle, alt, decorative = true }) {
  const meta = MASCOTS[name]
  // Bấm vào linh vật nào cũng nảy "boing" một cái — đổi key để remount <img> và
  // chạy lại animation từ đầu. Dùng onPointerDown (không phải onClick) nên không
  // chặn click của nút cha (avatar, banner...).
  const [boing, setBoing] = useState(0)
  if (!meta) return null
  const motion = idle ?? meta.idle

  return (
    <span
      className={`gf-mascot-wrap${motion !== 'none' ? ` gf-idle-${motion}` : ''} ${className}`}
      onPointerDown={() => setBoing((b) => b + 1)}
    >
      <img
        key={boing}
        className={`gf-mascot-img${boing ? ' gf-mascot-boing' : ''}`}
        src={`/mascots/${name}.png`}
        width={meta.w}
        height={meta.h}
        alt={decorative ? '' : (alt ?? meta.alt)}
        aria-hidden={decorative ? 'true' : undefined}
        draggable="false"
      />
    </span>
  )
}

// Ngôi sao lấp lánh 4 cánh — rải quanh bục top-3, avatar Profile và màn thăng hạng.
export function Sparkle({ className = '', style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z" fill="currentColor" />
    </svg>
  )
}
