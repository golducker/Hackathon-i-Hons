import ScreenHeader from '../components/ScreenHeader'
import Mascot from '../components/Mascot'
import Reveal from '../components/Reveal'
import { useFx } from '../contexts'
import { vouchers } from '../mockData'
import { playClickSound } from '../sound'

// "Your rewards" ở Home trỏ vào đây — danh sách voucher đã đổi (khác History, vốn là
// log đầy đủ mọi biến động điểm). Ghép redeemedVouchers (GenFreZApp) với dữ liệu tĩnh
// vouchers từ mockData để lấy tên/mô tả đầy đủ.
export default function MyVouchersScreen({ redeemedVouchers, onMarkUsed, onBack }) {
  const fx = useFx()
  const owned = vouchers
    .map((voucher) => ({ voucher, redemption: redeemedVouchers[voucher.id] }))
    .filter((entry) => entry.redemption)

  const handleMarkUsed = (voucherId, event) => {
    playClickSound()
    fx.burst(event.currentTarget, { count: 16, palette: 'orange', spread: 0.7 })
    onMarkUsed(voucherId)
  }

  return (
    <div className="gf-screen">
      <ScreenHeader
        title="Your rewards"
        subtitle="Vouchers you've redeemed, ready to use at the partner."
        onBack={onBack}
        mascot="heart-hug"
      />

      <div className="gf-screen-body">
        {owned.length === 0 && (
          <Reveal variant="pop" className="gf-empty-state">
            <Mascot name="fluffy-scared" className="gf-empty-mascot" />
            <p className="gf-modal-lede">No vouchers redeemed yet — head to Vouchers and grab one.</p>
          </Reveal>
        )}

        {owned.map(({ voucher, redemption }, i) => (
          <Reveal key={voucher.id} delay={i * 90}>
            <div className={`gf-voucher-card gf-ticket${redemption.usedAt ? ' gf-ticket-used' : ''}`}>
              <div className="gf-voucher-top">
                <div className="gf-ticket-heading">
                  <div className="gf-voucher-partner">{voucher.partner}</div>
                  <div className="gf-voucher-title">{voucher.title}</div>
                </div>
                <span className={`gf-voucher-status${redemption.usedAt ? ' gf-voucher-status-used' : ''}`}>
                  {redemption.usedAt ? 'Used' : 'Ready to use'}
                </span>
              </div>
              <div className="gf-ticket-divider" aria-hidden="true" />
              <div className="gf-redeem-confirm">
                <code>{redemption.deepLink}</code>
              </div>
              {!redemption.usedAt && (
                <button type="button" className="gf-voucher-btn" onClick={(e) => handleMarkUsed(voucher.id, e)}>
                  Mark as used
                </button>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
