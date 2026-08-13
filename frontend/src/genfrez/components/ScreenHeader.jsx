import { ChevronLeft } from 'lucide-react'
import { playClickSound } from '../sound'

// Header dùng chung cho các trang "pushed" (điều hướng ra ngoài 5 tab dưới):
// task nhiệm vụ, History, My rewards — luôn có nút quay lại Home.
export default function ScreenHeader({ title, subtitle, onBack }) {
  const handleBack = () => {
    playClickSound()
    onBack()
  }

  return (
    <div className="gf-screen-header gf-screen-header-back">
      <button type="button" className="gf-back-btn" aria-label="Back" onClick={handleBack}>
        <ChevronLeft size={20} strokeWidth={3} />
      </button>
      <div>
        <h1 className="gf-screen-title">{title}</h1>
        {subtitle && <p className="gf-screen-subtitle">{subtitle}</p>}
      </div>
    </div>
  )
}
