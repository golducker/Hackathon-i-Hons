import { useEffect } from 'react'
import { ChevronsRight } from 'lucide-react'
import Mascot, { Sparkle } from './Mascot'
import { playChargeSound, playLevelUpSound, playClickSound } from '../sound'

// Màn thăng hạng dựng lại theo nhịp cutscene "Rank Up":
//   0.0s  nền tối + tia sáng hiện dần
//   0.15s huy hiệu rơi vào, còn xám (đang khoá)
//   0.6s  huy hiệu rung, quầng sáng dày dần ("tích năng lượng")
//   1.15s CHỚP SÁNG toàn màn → huy hiệu bung màu vàng, sóng xung kích, confetti
//   1.4s+ chữ RANK UP, Silver → Gold, tên hạng, linh vật nhảy vào ăn mừng, nút đóng
//
// Lỗi của bản cũ: keyframe pop của huy hiệu không giữ opacity ở 100%, nên khi
// animation kết thúc (fill-mode forwards) opacity rơi về giá trị gốc 0 → huy hiệu
// biến mất. Bản này mọi keyframe đều khai báo đủ trạng thái cuối + fill-mode both.
// Overlay giờ nằm thẳng trong khung điện thoại (PhoneFrame `overlay`), không còn
// nằm trong vùng cuộn, nên luôn phủ kín cả status bar lẫn thanh tab.

// Random "giả" theo chỉ số — vị trí hạt cố định giữa các lần render (render thuần).
function seeded(i, salt) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

const CONFETTI_COLORS = ['#ffd45a', '#f26a1b', '#2a93ad', '#f2a6c9', '#4ee08a', '#ffffff']

const CONFETTI = Array.from({ length: 36 }, (_, i) => {
  const angle = (i / 36) * Math.PI * 2 + seeded(i, 1) * 0.4
  const dist = 110 + seeded(i, 2) * 120
  return {
    dx: Math.cos(angle) * dist,
    dy: Math.sin(angle) * dist,
    rot: Math.round(seeded(i, 3) * 900 - 450),
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    shape: i % 3 === 0 ? 'leaf' : i % 3 === 1 ? 'rect' : 'dot',
    delay: Math.round(seeded(i, 4) * 120),
  }
})

const EMBERS = Array.from({ length: 18 }, (_, i) => ({
  x: `${Math.round(seeded(i, 5) * 100)}%`,
  d: `${(3.5 + seeded(i, 6) * 3).toFixed(2)}s`,
  delay: `${(1.1 + seeded(i, 7) * 3).toFixed(2)}s`,
  s: (0.5 + seeded(i, 8)).toFixed(2),
}))

const SPARKLES = [
  { x: -118, y: -70, s: 22, delay: 1.25 },
  { x: 112, y: -88, s: 16, delay: 1.35 },
  { x: -96, y: 74, s: 14, delay: 1.45 },
  { x: 120, y: 58, s: 24, delay: 1.3 },
  { x: 4, y: -132, s: 18, delay: 1.4 },
]

export default function RankUpCelebration({ fromTier, tierName, onClose }) {
  useEffect(() => {
    playChargeSound()
    const t = setTimeout(playLevelUpSound, 1150)
    return () => clearTimeout(t)
  }, [])

  const handleClose = () => {
    playClickSound()
    onClose()
  }

  return (
    <div
      className="gf-rankup"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gf-rankup-title"
      onKeyDown={(e) => e.key === 'Escape' && handleClose()}
    >
      <div className="gf-rankup-bg" aria-hidden="true" />
      <div className="gf-rankup-rays gf-rankup-rays-a" aria-hidden="true" />
      <div className="gf-rankup-rays gf-rankup-rays-b" aria-hidden="true" />

      <div className="gf-rankup-embers" aria-hidden="true">
        {EMBERS.map((e, i) => (
          <span key={i} style={{ '--x': e.x, '--d': e.d, '--delay': e.delay, '--s': e.s }} />
        ))}
      </div>

      <div className="gf-rankup-stage">
        <div className="gf-rankup-badge-area" aria-hidden="true">
          <span className="gf-rankup-halo" />
          <span className="gf-rankup-shock gf-rankup-shock-1" />
          <span className="gf-rankup-shock gf-rankup-shock-2" />
          <span className="gf-rankup-shock gf-rankup-shock-3" />

          <div className="gf-rankup-confetti">
            {CONFETTI.map((p, i) => (
              <span
                key={i}
                className={`gf-rankup-confetti-${p.shape}`}
                style={{
                  '--dx': `${p.dx.toFixed(1)}px`,
                  '--dy': `${p.dy.toFixed(1)}px`,
                  '--rot': `${p.rot}deg`,
                  '--c': p.color,
                  '--d': `${p.delay}ms`,
                }}
              />
            ))}
          </div>

          {/* 2 lớp lồng nhau vì mỗi lớp chạy animation transform riêng: lớp ngoài rơi
              vào + lơ lửng, lớp trong rung tích năng lượng + nảy khi bung màu. Dồn hết vào
              một phần tử thì animation sau đè animation trước. */}
          <div className="gf-rankup-badge">
            <div className="gf-rankup-badge-core">
              <img src="/rank-gold.png" alt="" className="gf-rankup-badge-img" draggable="false" />
              <span className="gf-rankup-badge-shine" />
            </div>
          </div>

          {SPARKLES.map((s, i) => (
            <Sparkle
              key={i}
              className="gf-rankup-sparkle"
              style={{ '--x': `${s.x}px`, '--y': `${s.y}px`, '--sz': `${s.s}px`, '--delay': `${s.delay}s` }}
            />
          ))}
        </div>

        <p className="gf-rankup-kicker">RANK UP</p>
        <div className="gf-rankup-tiers" aria-hidden="true">
          <span className="gf-rankup-tier-old">{fromTier}</span>
          <ChevronsRight size={18} strokeWidth={3} />
          <span className="gf-rankup-tier-new">{tierName}</span>
        </div>
        <h2 id="gf-rankup-title" className="gf-rankup-title">
          {tierName}
        </h2>
        <p className="gf-rankup-sub">You&apos;ve reached the {tierName} tier. Keep riding green!</p>

        <button type="button" className="gf-voucher-btn gf-btn-shine gf-rankup-cta" onClick={handleClose} autoFocus>
          Let&apos;s go!
        </button>
      </div>

      <div className="gf-rankup-mascots" aria-hidden="true">
        <Mascot name="heart-hug" idle="none" className="gf-rankup-mascot gf-rankup-mascot-1" />
        <Mascot name="star-cool" idle="none" className="gf-rankup-mascot gf-rankup-mascot-2" />
      </div>

      <div className="gf-rankup-flash" aria-hidden="true" />
    </div>
  )
}
