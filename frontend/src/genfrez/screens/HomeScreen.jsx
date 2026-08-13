import { useState } from 'react'
import MissionCard from '../components/MissionCard'
import Mascot from '../components/Mascot'
import { missions, greenChallenges } from '../mockData'

function fmtScore(n) {
  return n.toLocaleString('vi-VN', { maximumFractionDigits: 0 })
}

// Bản rút gọn (10.000 -> 10k) chỉ dùng cho ô phân số trong thanh tiến độ My Tier —
// khung đó hẹp, số đầy đủ dễ tràn khỏi placeholder khi điểm lên tới hàng chục nghìn.
function fmtCompact(n) {
  if (n < 1000) return fmtScore(n)
  const k = n / 1000
  return `${Number.isInteger(k) ? k : k.toFixed(1)}k`
}

export default function HomeScreen({ userProfile }) {
  const { name, score, tier } = userProfile
  const progressPct = Math.min(100, Math.round((score / tier.nextThreshold) * 100))
  const remaining = Math.max(0, tier.nextThreshold - score)
  const [openChallengeId, setOpenChallengeId] = useState(null)

  return (
    <>
      <header className="gf-header">
        <div className="gf-header-row">
          <span className="gf-logo">GenFreZ</span>
          <div className="gf-avatar" aria-hidden="true">
            <Mascot className="gf-avatar-mascot" />
          </div>
        </div>
        <p className="gf-greeting">Hello, {name}!</p>

        <div className="gf-stat-cards">
          <div className="gf-stat-card">
            <span className="gf-stat-label">My Score</span>
            <div className="gf-score-row">
              <span className="gf-score-badge">F</span>
              <span className="gf-score-value">{fmtScore(score)}</span>
            </div>
          </div>

          <div className="gf-stat-card">
            <span className="gf-stat-label">My Tier</span>
            <div className="gf-tier-row">
              <span className="gf-tier-icon" aria-hidden="true">
                🌱
              </span>
              <div className="gf-tier-track">
                <div className="gf-tier-fill" style={{ width: `${progressPct}%` }} />
                <span className="gf-tier-fraction">
                  {fmtCompact(score)} / {fmtCompact(tier.nextThreshold)}
                </span>
              </div>
              <span className="gf-tier-icon" aria-hidden="true">
                🪴
              </span>
            </div>
            <p className="gf-tier-caption">
              {remaining > 0 ? (
                <>
                  <strong>{fmtScore(remaining)}</strong> more points and <strong>{tier.next}</strong> is yours!
                </>
              ) : (
                <strong>You reached {tier.next}!</strong>
              )}
            </p>
          </div>
        </div>
      </header>

      <div className="gf-body">
        <h2 className="gf-section-title">Missions</h2>
        <div className="gf-mission-list">
          {missions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>

        <h2 className="gf-section-title">Green Challenges</h2>
        <div className="gf-challenges-card">
          {greenChallenges.map((challenge) => {
            const isOpen = openChallengeId === challenge.id
            return (
              <div key={challenge.id}>
                <button
                  type="button"
                  className="gf-challenge-pill"
                  aria-expanded={isOpen}
                  onClick={() => setOpenChallengeId(isOpen ? null : challenge.id)}
                >
                  <span className="gf-challenge-title">{challenge.title}</span>
                  <span className="gf-challenge-arrow" aria-hidden="true">
                    ›
                  </span>
                </button>
                {isOpen && (
                  <p className="gf-challenge-detail">
                    {challenge.sponsor} — {challenge.description}
                  </p>
                )}
              </div>
            )
          })}
          <Mascot className="gf-mascot" />
        </div>
      </div>
    </>
  )
}
