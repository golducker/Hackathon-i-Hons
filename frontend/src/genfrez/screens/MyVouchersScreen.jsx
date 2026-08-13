import ScreenHeader from '../components/ScreenHeader'
import { vouchers } from '../mockData'
import { playClickSound } from '../sound'

// "Your rewards" ở Home trỏ vào đây — danh sách voucher đã đổi (khác History, vốn là
// log đầy đủ mọi biến động điểm). Ghép redeemedVouchers (GenFreZApp) với dữ liệu tĩnh
// vouchers từ mockData để lấy tên/mô tả đầy đủ.
export default function MyVouchersScreen({ redeemedVouchers, onMarkUsed, onBack }) {
  const owned = vouchers
    .map((voucher) => ({ voucher, redemption: redeemedVouchers[voucher.id] }))
    .filter((entry) => entry.redemption)

  const handleMarkUsed = (voucherId) => {
    playClickSound()
    onMarkUsed(voucherId)
  }

  return (
    <div className="gf-screen gf-page-enter">
      <ScreenHeader title="Your rewards" subtitle="Vouchers you've redeemed, ready to use at the partner." onBack={onBack} />

      <div className="gf-screen-body">
        {owned.length === 0 && (
          <p className="gf-modal-lede">No vouchers redeemed yet — head to Vouchers and grab one.</p>
        )}

        {owned.map(({ voucher, redemption }) => (
          <div key={voucher.id} className="gf-voucher-card">
            <div className="gf-voucher-top">
              <div>
                <div className="gf-voucher-partner">{voucher.partner}</div>
                <div className="gf-voucher-title">{voucher.title}</div>
              </div>
              <span className={`gf-voucher-status${redemption.usedAt ? ' gf-voucher-status-used' : ''}`}>
                {redemption.usedAt ? 'Used' : 'Ready to use'}
              </span>
            </div>
            <div className="gf-redeem-confirm">
              <code>{redemption.deepLink}</code>
            </div>
            {!redemption.usedAt && (
              <button type="button" className="gf-voucher-btn" onClick={() => handleMarkUsed(voucher.id)}>
                Mark as used
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
