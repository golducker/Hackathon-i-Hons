import { useState } from 'react'
import { TreeDeciduous } from 'lucide-react'
import ScreenHeader from '../components/ScreenHeader'
import {
  calculatePoints,
  co2GramsToTreeHours,
  VEHICLE_FACTORS,
  ADDITIONALITY,
  TREE_ABSORPTION_KG_PER_YEAR,
} from '../emissions'
import { playClickSound } from '../sound'

function formatTreeDuration(hours) {
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))} minutes`
  if (hours < 24) return `${hours.toFixed(1)} hours`
  const days = Math.floor(hours / 24)
  const remHours = Math.round(hours % 24)
  return remHours > 0 ? `${days}d ${remHours}h` : `${days} day${days > 1 ? 's' : ''}`
}

// Trang task riêng — thay cho modal cũ. Streak Rider/Green Steps (có `trip`) hiện
// breakdown công thức BMC §5.5 + ẩn dụ cây xanh mang tính minh hoạ; Crew Recruiter
// (không có `trip`) hiện nội dung referral. Điểm thật cộng vào ví luôn là
// mission.rewardPoints — xem lý do ở mockData.js.
export default function TaskDetailScreen({ mission, completed, onComplete, onBack }) {
  const hasTrip = Boolean(mission.trip)

  const [calc] = useState(() => {
    if (!hasTrip) return null
    const c = calculatePoints({
      distanceKm: mission.trip.distanceKm,
      baselineVehicle: 'petrolMoto',
      replacementVehicle: mission.trip.replacementVehicle,
      confidenceTier: mission.trip.confidenceTier,
      additionality: ADDITIONALITY.NEW_USER,
    })
    return {
      ...c,
      baselineG: mission.trip.distanceKm * VEHICLE_FACTORS.petrolMoto.gPerKm,
      treeHours: co2GramsToTreeHours(c.co2AvoidedG),
      treeAbsorptionKgPerYear: TREE_ABSORPTION_KG_PER_YEAR,
    }
  })

  const handleComplete = () => {
    playClickSound()
    if (completed) return
    onComplete(mission.rewardPoints)
  }

  return (
    <div className="gf-screen gf-page-enter">
      <ScreenHeader
        title={mission.tag}
        subtitle={hasTrip ? 'Green transport mission' : 'Referral mission'}
        onBack={onBack}
      />

      <div className="gf-screen-body">
        <p className="gf-modal-lede">{mission.description}</p>

        {hasTrip ? (
          <>
            <p className="gf-modal-lede">
              A petrol motorbike would have emitted <strong>{calc.baselineG.toFixed(0)}g CO2</strong> for
              this {mission.trip.distanceKm}km trip. Here is how the avoided-emissions formula (BMC §5.5)
              breaks it down — this is illustrative, not the point payout below.
            </p>

            <div className="gf-scan-result">
              {calc.steps.map((step) => (
                <div key={step.label} className="gf-scan-step-row">
                  <span>{step.label}</span>
                  <span>{step.value}</span>
                </div>
              ))}
            </div>

            <div className="gf-tree-metaphor">
              <TreeDeciduous size={28} />
              <p>
                That is the same as a mature tree working for{' '}
                <strong>{formatTreeDuration(calc.treeHours)}</strong> to absorb the equivalent CO2 —
                assuming ~{calc.treeAbsorptionKgPerYear}kg CO2/tree/year (reference estimate, not a field
                measurement).
              </p>
            </div>
          </>
        ) : (
          <div className="gf-profile-card">
            <p className="gf-voucher-note">
              Invite friends with your referral code — more riders, more points for everyone (BMC §4.1
              Green Ambassador).
            </p>
            <div className="gf-referral-code">GENFREZ-TEO-2026</div>
            <p className="gf-voucher-note">0 / 3 friends joined so far.</p>
          </div>
        )}

        <div className="gf-scan-total">
          Mission reward: +{mission.rewardPoints.toLocaleString('vi-VN')} points
        </div>

        <button type="button" className="gf-voucher-btn" disabled={completed} onClick={handleComplete}>
          {completed ? 'Completed ✓' : 'Complete mission'}
        </button>
      </div>
    </div>
  )
}
