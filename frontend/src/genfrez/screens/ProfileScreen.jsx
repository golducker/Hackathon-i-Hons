import { verificationTiers } from '../mockData'

function fmtScore(n) {
  return n.toLocaleString('vi-VN', { maximumFractionDigits: 0 })
}

export default function ProfileScreen({ userProfile }) {
  const { name, score, tier } = userProfile

  return (
    <div className="gf-screen">
      <div className="gf-screen-header">
        <h1 className="gf-screen-title">Profile</h1>
        <p className="gf-screen-subtitle">Hello, {name}!</p>
      </div>

      <div className="gf-screen-body">
        <div className="gf-profile-card">
          <div className="gf-voucher-top">
            <span className="gf-voucher-partner">Current tier</span>
            <span className="gf-voucher-cost">{tier.current}</span>
          </div>
          <div className="gf-voucher-top">
            <span className="gf-voucher-partner">Total score</span>
            <span className="gf-voucher-cost">{fmtScore(score)} pts</span>
          </div>
        </div>

        <p className="gf-group-label">Verification tiers (BMC §7.3)</p>
        <div className="gf-profile-card">
          {verificationTiers.map((t) => (
            <div key={t.id} className="gf-tier-legend-row">
              <div>
                <div className="gf-tier-legend-label">{t.label}</div>
                <div className="gf-tier-legend-note">{t.note}</div>
              </div>
              <span className="gf-leaderboard-points">{t.confidence}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
