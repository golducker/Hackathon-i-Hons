import { useEffect } from 'react'
import { SparkleDecoration } from './MascotArt'
import { playLevelUpSound, playClickSound } from '../sound'

// Hiệu ứng thăng hạng phỏng theo nhịp cutscene "Rank Up" quen thuộc (khoá xám →
// mở khoá màu thật → chớp sáng → bóng quét). Cố tình chỉ dùng ĐÚNG MỘT ảnh
// rank-gold.png, đổi màu bằng filter animation (grayscale → màu thật) thay vì
// chồng 2 lớp ảnh + clip-path như bản trước — bản 2 lớp từng bị ẩn mất sau khi
// hiệu ứng chạy xong, một ảnh + filter đơn giản hơn nên không còn chỗ để lỗi đó
// xảy ra. Không có file gốc của đúng clip Valorant nên đây là bản dựng lại theo
// trí nhớ về mô-típ rank-up quen thuộc, không phải copy khung hình thật.
export default function RankUpCelebration({ tierName, onClose }) {
  useEffect(() => {
    playLevelUpSound()
  }, [])

  const handleClose = () => {
    playClickSound()
    onClose()
  }

  return (
    <div className="gf-rankup-overlay" role="dialog" aria-modal="true">
      <div className="gf-rankup-rays" aria-hidden="true" />

      <div className="gf-rankup-sparkles" aria-hidden="true">
        <SparkleDecoration className="gf-rankup-sparkle gf-rankup-sparkle-1" />
        <SparkleDecoration className="gf-rankup-sparkle gf-rankup-sparkle-2" />
        <SparkleDecoration className="gf-rankup-sparkle gf-rankup-sparkle-3" />
        <SparkleDecoration className="gf-rankup-sparkle gf-rankup-sparkle-4" />
        <SparkleDecoration className="gf-rankup-sparkle gf-rankup-sparkle-5" />
        <SparkleDecoration className="gf-rankup-sparkle gf-rankup-sparkle-6" />
      </div>

      <div className="gf-rankup-badge">
        <img src="/rank-gold.png" alt={`${tierName} rank badge`} className="gf-rankup-badge-img" />
        <span className="gf-rankup-badge-flash" aria-hidden="true" />
        <span className="gf-rankup-badge-shine" aria-hidden="true" />
      </div>

      <div className="gf-rankup-text">
        <p className="gf-rankup-kicker">RANK UP</p>
        <h2 className="gf-rankup-title">{tierName}</h2>
        <p className="gf-rankup-sub">You&apos;ve reached the {tierName} tier — keep riding green.</p>

        <button type="button" className="gf-voucher-btn gf-rankup-cta" onClick={handleClose}>
          Nice!
        </button>
      </div>
    </div>
  )
}
