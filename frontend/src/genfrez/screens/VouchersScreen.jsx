import { vouchers } from '../mockData'
import { PointsBadge } from '../components/PointsIcon'
import Mascot from '../components/Mascot'
import Reveal from '../components/Reveal'
import { useFx } from '../contexts'
import { useCountUp } from '../hooks'
import { playClickSound, playRewardSound } from '../sound'

function fmtScore(n) {
  return n.toLocaleString('vi-VN', { maximumFractionDigits: 0 })
}

// Chữ cái đầu của đối tác làm "logo" tròn trên vé (demo không có logo thật).
function initials(partner) {
  return partner
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export default function VouchersScreen({ balance, redeemedVouchers, onRedeem, onViewMyVouchers }) {
  const fx = useFx()
  const shownBalance = useCountUp(balance, { key: 'home-score', duration: 900 })
  const visibleVouchers = vouchers.filter((v) => !v.gated || v.eligible)
  const group1 = visibleVouchers.filter((v) => v.group === '1')
  const group2 = visibleVouchers.filter((v) => v.group === '2')

  const handleRedeem = (voucher, event) => {
    playClickSound()
    playRewardSound()
    fx.burst(event.currentTarget, { text: `−${fmtScore(voucher.costPoints)}`, palette: 'orange', count: 22 })
    onRedeem(voucher)
  }

  const handleViewMyVouchers = () => {
    playClickSound()
    onViewMyVouchers()
  }

  const renderVoucher = (voucher, i) => {
    const affordable = balance >= voucher.costPoints
    const done = redeemedVouchers[voucher.id]
    return (
      <Reveal key={voucher.id} delay={i * 90}>
        <div className={`gf-voucher-card gf-ticket gf-ticket-group-${voucher.group}`}>
          <div className="gf-voucher-top">
            <span className="gf-ticket-logo" aria-hidden="true">
              {initials(voucher.partner)}
            </span>
            <div className="gf-ticket-heading">
              <div className="gf-voucher-partner">{voucher.partner}</div>
              <div className="gf-voucher-title">{voucher.title}</div>
            </div>
            <div className="gf-voucher-cost">
              <PointsBadge size={16} />
              {fmtScore(voucher.costPoints)}
            </div>
          </div>
          <div className="gf-ticket-divider" aria-hidden="true" />
          <p className="gf-voucher-note">{voucher.note}</p>
          <button
            type="button"
            className={`gf-voucher-btn${affordable && !done ? ' gf-btn-shine' : ''}`}
            disabled={!affordable || Boolean(done)}
            onClick={(e) => handleRedeem(voucher, e)}
          >
            {done ? 'Redeemed ✓' : affordable ? 'Redeem now' : 'Not enough points'}
          </button>
          {done && (
            <div className="gf-redeem-confirm gf-pop-in">
              Voucher code generated. In production this hands off to {voucher.partner}&apos;s own checkout — the
              platform never holds funds (BMC §5.1, §7.5).
              <code>{done.deepLink}</code>
              <button type="button" className="gf-inline-link" onClick={handleViewMyVouchers}>
                View in Your rewards →
              </button>
            </div>
          )}
        </div>
      </Reveal>
    )
  }

  return (
    <div className="gf-screen">
      <div className="gf-vouchers-header">
        <div className="gf-vouchers-header-row">
          <span className="gf-logo">GenFreZ</span>
          <span className="gf-vouchers-balance">
            Your balance: <strong>{fmtScore(shownBalance)}</strong> <PointsBadge size={20} />
          </span>
        </div>
        <div className="gf-vouchers-hero">
          <Mascot name="blue-wave" className="gf-vouchers-hero-mascot gf-vouchers-hero-mascot-left" />
          <h1 className="gf-vouchers-title">Vouchers</h1>
          <Mascot name="star-cool" className="gf-vouchers-hero-mascot gf-vouchers-hero-mascot-right" />
        </div>
      </div>

      <div className="gf-screen-body">
        <Reveal variant="left">
          <h2 className="gf-section-title-left">Green Transport</h2>
        </Reveal>
        {group1.map(renderVoucher)}

        <Reveal variant="left">
          <h2 className="gf-section-title-left">Partner Rewards</h2>
        </Reveal>
        {group2.map(renderVoucher)}
      </div>
    </div>
  )
}
