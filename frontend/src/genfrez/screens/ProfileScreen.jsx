import { computeLiveLeaderboard, verificationTiers, weeklyStats } from '../mockData'
import { PinkBlobMascot } from '../components/MascotArt'

function fmtScore(n) {
  return n.toLocaleString('vi-VN', { maximumFractionDigits: 0 })
}

const CHART_MAX_KM = 10

export default function ProfileScreen({ userProfile }) {
  const { score } = userProfile

  // Cùng công thức xếp hạng với Leaderboard (mockData.computeLiveLeaderboard) —
  // đổi điểm ở đâu trong app thì "Your rank" ở đây cũng tính lại theo, không lệch.
  const yourRank = computeLiveLeaderboard(score).find((entry) => entry.nickname === 'teo.rides')?.rank
  const totalKm = weeklyStats.days.reduce((sum, day) => sum + day.km, 0)

  return (
    <div className="gf-screen">
      <div className="gf-profile-header">
        <div className="gf-header-row">
          <span className="gf-logo">GenFreZ</span>
          <span className="gf-leaderboard-rank">
            Your rank: <strong>#{yourRank}</strong>
          </span>
        </div>
        <h1 className="gf-profile-title">Profile</h1>
        <div className="gf-profile-avatar">
          <PinkBlobMascot className="gf-profile-avatar-mascot" />
        </div>
      </div>

      <div className="gf-screen-body">
        <h2 className="gf-section-title-left">Statistics</h2>
        <p className="gf-profile-stats-subtitle">This week</p>

        <div className="gf-stats-card">
          <div className="gf-stats-totals">
            <div className="gf-stats-total-block">
              <span className="gf-stats-total-value">{totalKm.toFixed(2)}</span>
              <span className="gf-stats-total-label">green kilometers</span>
            </div>
            <div className="gf-stats-total-block">
              <span className="gf-stats-total-value">{fmtScore(weeklyStats.pointsAchieved)}</span>
              <span className="gf-stats-total-label">points achieved</span>
            </div>
          </div>

          <div className="gf-stats-chart">
            <div className="gf-stats-chart-axis">
              {[10, 8, 6, 4, 2, 0].map((tick) => (
                <span key={tick}>{tick}</span>
              ))}
            </div>
            <div className="gf-stats-chart-bars">
              {weeklyStats.days.map((day) => (
                <div key={day.label} className="gf-stats-chart-col">
                  <span className="gf-stats-chart-value">{day.km.toFixed(2)}</span>
                  <div
                    className="gf-stats-chart-bar"
                    style={{ height: `${Math.max(4, (day.km / CHART_MAX_KM) * 100)}%` }}
                  />
                  <span className="gf-stats-chart-day">{day.label}</span>
                </div>
              ))}
            </div>
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
