import { ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react'
import ScreenHeader from '../components/ScreenHeader'

function fmtScore(n) {
  return n.toLocaleString('vi-VN', { maximumFractionDigits: 0 })
}

function fmtTime(ts) {
  return new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const ICONS = { mission: ArrowUpRight, scan: ArrowUpRight, redeem: ArrowDownRight, voucher_used: CheckCircle2 }

// Log đầy đủ mọi biến động số dư: hoàn thành nhiệm vụ, quét chuyến đi, đổi voucher,
// đánh dấu voucher đã dùng. `history` sống ở GenFreZApp nên không mất khi đổi tab.
export default function HistoryScreen({ history, onBack }) {
  return (
    <div className="gf-screen gf-page-enter">
      <ScreenHeader title="History" subtitle="Every point earned or spent, and every voucher lifecycle event." onBack={onBack} />

      <div className="gf-screen-body">
        {history.length === 0 && (
          <p className="gf-modal-lede">
            No activity yet — complete a mission, scan a trip, or redeem a voucher to see it here.
          </p>
        )}

        {history.map((entry) => {
          const Icon = ICONS[entry.type] ?? ArrowUpRight
          const trend = entry.pointsDelta > 0 ? 'up' : entry.pointsDelta < 0 ? 'down' : 'flat'
          return (
            <div key={entry.id} className="gf-history-row">
              <span className={`gf-history-icon gf-history-icon-${trend}`}>
                <Icon size={18} />
              </span>
              <div className="gf-history-info">
                <div className="gf-history-title">{entry.title}</div>
                <div className="gf-history-detail">{entry.detail}</div>
                <div className="gf-history-time">{fmtTime(entry.timestamp)}</div>
              </div>
              {entry.pointsDelta !== 0 && (
                <span className={`gf-history-delta gf-history-delta-${trend}`}>
                  {entry.pointsDelta > 0 ? '+' : ''}
                  {fmtScore(Math.round(entry.pointsDelta))}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
