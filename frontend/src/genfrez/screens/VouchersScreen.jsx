import { vouchers } from '../mockData'
import { PointsBadge } from '../components/PointsIcon'
import { BlueStarMascot, PinkStarMascot } from '../components/MascotArt'
import { playClickSound } from '../sound'

function fmtScore(n) {
  return n.toLocaleString('vi-VN', { maximumFractionDigits: 0 })
}

export default function VouchersScreen({ balance, redeemedVouchers, onRedeem, onViewMyVouchers }) {
  const visibleVouchers = vouchers.filter((v) => !v.gated || v.eligible)
  const group1 = visibleVouchers.filter((v) => v.group === '1')
  const group2 = visibleVouchers.filter((v) => v.group === '2')

  const handleRedeem = (voucher) => {
    playClickSound()
    onRedeem(voucher)
  }

  const handleViewMyVouchers = () => {
    playClickSound()
    onViewMyVouchers()
  }

  const renderVoucher = (voucher) => {
    const affordable = balance >= voucher.costPoints
    const done = redeemedVouchers[voucher.id]
    return (
      <div key={voucher.id} className="gf-voucher-card">
        <div className="gf-voucher-top">
          <div>
            <div className="gf-voucher-partner">{voucher.partner}</div>
            <div className="gf-voucher-title">{voucher.title}</div>
          </div>
          <div className="gf-voucher-cost">{fmtScore(voucher.costPoints)} points</div>
        </div>
        <p className="gf-voucher-note">{voucher.note}</p>
        <button
          type="button"
          className="gf-voucher-btn"
          disabled={!affordable || Boolean(done)}
          onClick={() => handleRedeem(voucher)}
        >
          {done ? 'Redeemed' : affordable ? 'Redeem now' : 'Not enough points'}
        </button>
        {done && (
          <div className="gf-redeem-confirm">
            Voucher code generated. In production this hands off to {voucher.partner}&apos;s own
            checkout — the platform never holds funds (BMC §5.1, §7.5).
            <code>{done.deepLink}</code>
            <button type="button" className="gf-inline-link" onClick={handleViewMyVouchers}>
              View in Your rewards →
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="gf-screen">
      <div className="gf-vouchers-header">
        <div className="gf-vouchers-header-row">
          <span className="gf-logo">GenFreZ</span>
          <span className="gf-vouchers-balance">
            Your balance: <strong>{fmtScore(balance)}</strong> <PointsBadge size={20} />
          </span>
        </div>
        <div className="gf-vouchers-hero">
          <BlueStarMascot className="gf-vouchers-hero-mascot gf-vouchers-hero-mascot-left" />
          <h1 className="gf-vouchers-title">Vouchers</h1>
          <PinkStarMascot className="gf-vouchers-hero-mascot gf-vouchers-hero-mascot-right" />
        </div>
      </div>

      <div className="gf-screen-body">
        <h2 className="gf-section-title-left">Green Transport</h2>
        {group1.map(renderVoucher)}

        <h2 className="gf-section-title-left">Partner Rewards</h2>
        {group2.map(renderVoucher)}
      </div>
    </div>
  )
}
