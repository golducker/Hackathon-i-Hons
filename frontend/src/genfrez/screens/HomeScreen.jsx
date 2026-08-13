import { useState } from 'react'
import MissionCard from '../components/MissionCard'
import MissionResultModal from '../components/MissionResultModal'
import Mascot from '../components/Mascot'
import { missions, greenChallenges } from '../mockData'
import { calculatePoints, co2GramsToTreeHours, VEHICLE_FACTORS, ADDITIONALITY, TREE_ABSORPTION_KG_PER_YEAR } from '../emissions'

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

export default function HomeScreen({ userProfile, onEarnPoints }) {
  const { name, score, tier } = userProfile
  const progressPct = Math.min(100, Math.round((score / tier.nextThreshold) * 100))
  const remaining = Math.max(0, tier.nextThreshold - score)
  const [openChallengeId, setOpenChallengeId] = useState(null)

  // Kết quả hoàn thành từng nhiệm vụ, khoá theo id — chỉ tính (và cộng điểm) một lần,
  // click lại chỉ mở lại modal để xem lại kết quả, không cộng điểm thêm lần nữa.
  const [missionResults, setMissionResults] = useState({})
  const [activeMissionId, setActiveMissionId] = useState(null)
  const activeMission = missions.find((m) => m.id === activeMissionId) ?? null

  const handleOpenMission = (mission) => {
    if (!missionResults[mission.id]) {
      let result
      if (mission.trip) {
        const calc = calculatePoints({
          distanceKm: mission.trip.distanceKm,
          baselineVehicle: 'petrolMoto',
          replacementVehicle: mission.trip.replacementVehicle,
          confidenceTier: mission.trip.confidenceTier,
          additionality: ADDITIONALITY.NEW_USER,
        })
        result = {
          ...calc,
          baselineG: mission.trip.distanceKm * VEHICLE_FACTORS.petrolMoto.gPerKm,
          treeHours: co2GramsToTreeHours(calc.co2AvoidedG),
          treeAbsorptionKgPerYear: TREE_ABSORPTION_KG_PER_YEAR,
        }
      } else {
        result = { points: mission.rewardPoints }
      }
      onEarnPoints(result.points)
      setMissionResults((prev) => ({ ...prev, [mission.id]: result }))
    }
    setActiveMissionId(mission.id)
  }

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
            <MissionCard
              key={mission.id}
              mission={mission}
              completed={Boolean(missionResults[mission.id])}
              onOpen={handleOpenMission}
            />
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

      <MissionResultModal
        mission={activeMission}
        result={activeMission ? missionResults[activeMission.id] : null}
        onClose={() => setActiveMissionId(null)}
      />
    </>
  )
}
