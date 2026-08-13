import { useState } from 'react'
import { vouchers } from '../mockData'

function fmtScore(n) {
  return n.toLocaleString('vi-VN', { maximumFractionDigits: 0 })
}

// Mô phỏng deep link + verification token của BMC §7.6 — chỉ là chuỗi minh hoạ,
// không có backend thật đứng sau, không xử lý thanh toán.
function generateRedemption(voucher) {
  const token = Math.random().toString(36).slice(2, 10).toUpperCase()
  return {
    code: `GFZ-${voucher.id.slice(0, 4).toUpperCase()}-${token}`,
    deepLink: `genfrez://redeem?voucher=${voucher.id}&token=${token}`,
  }
}

export default function VouchersScreen({ balance, onRedeem }) {
  const [redeemed, setRedeemed] = useState({})

  const visibleVouchers = vouchers.filter((v) => !v.gated || v.eligible)
  const group1 = visibleVouchers.filter((v) => v.group === '1')
  const group2 = visibleVouchers.filter((v) => v.group === '2')

  const handleRedeem = (voucher) => {
    if (balance < voucher.costPoints || redeemed[voucher.id]) return
    onRedeem(voucher.costPoints)
    setRedeemed((prev) => ({ ...prev, [voucher.id]: generateRedemption(voucher) }))
  }

  const renderVoucher = (voucher) => {
    const affordable = balance >= voucher.costPoints
    const done = redeemed[voucher.id]
    return (
      <div key={voucher.id} className="gf-voucher-card">
        <div className="gf-voucher-top">
          <div>
            <div className="gf-voucher-partner">{voucher.partner}</div>
            <div className="gf-voucher-title">{voucher.title}</div>
          </div>
          <div className="gf-voucher-cost">{fmtScore(voucher.costPoints)} pts</div>
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
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="gf-screen">
      <div className="gf-screen-header">
        <h1 className="gf-screen-title">Vouchers</h1>
        <p className="gf-screen-subtitle">Your balance: {fmtScore(balance)} points</p>
      </div>

      <div className="gf-screen-body">
        <p className="gf-group-label">Group 1 · Green transport</p>
        {group1.map(renderVoucher)}

        <p className="gf-group-label">Group 2 · Partner rewards</p>
        {group2.map(renderVoucher)}
      </div>
    </div>
  )
}
