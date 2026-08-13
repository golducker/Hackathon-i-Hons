import { CheckCircle2, TreeDeciduous, X } from 'lucide-react'

function formatTreeDuration(hours) {
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))} minutes`
  if (hours < 24) return `${hours.toFixed(1)} hours`
  const days = Math.floor(hours / 24)
  const remHours = Math.round(hours % 24)
  return remHours > 0 ? `${days}d ${remHours}h` : `${days} day${days > 1 ? 's' : ''}`
}

// Modal che toàn màn hình điện thoại khi một nhiệm vụ được đánh dấu hoàn thành.
// `result` tới từ HomeScreen: có `steps`/`co2AvoidedG`/`treeHours` cho nhiệm vụ
// transport (Streak Rider, Green Steps), hoặc chỉ có `points` cho Crew Recruiter.
export default function MissionResultModal({ mission, result, onClose }) {
  if (!mission || !result) return null
  const hasTrip = Boolean(mission.trip)

  return (
    <div className="gf-modal-overlay" role="dialog" aria-modal="true">
      <div className="gf-modal-card">
        <button type="button" className="gf-modal-close" aria-label="Close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="gf-modal-banner">
          <CheckCircle2 size={22} />
          <span>Mission completed — {mission.tag}</span>
        </div>

        {hasTrip ? (
          <>
            <p className="gf-modal-lede">
              A petrol motorbike would have emitted{' '}
              <strong>{result.baselineG.toFixed(0)}g CO2</strong> for this {mission.trip.distanceKm}km trip.
              Here is how your points were calculated instead.
            </p>

            <div className="gf-scan-result">
              {result.steps.map((step) => (
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
                <strong>{formatTreeDuration(result.treeHours)}</strong> to absorb the equivalent CO2 —
                assuming ~{result.treeAbsorptionKgPerYear}kg CO2/tree/year (reference estimate, BMC-style
                assumption, not a field measurement).
              </p>
            </div>

            <div className="gf-scan-total">
              +{result.points.toFixed(2)} points (≈ {Math.round(result.voucherValueVnd)}đ)
            </div>
          </>
        ) : (
          <p className="gf-modal-lede">
            No trip to measure here — Crew Recruiter is a referral action, not a transit action, so it
            skips the emissions comparison and pays out a flat reward.
          </p>
        )}

        {!hasTrip && <div className="gf-scan-total">+{result.points} points</div>}

        <button type="button" className="gf-voucher-btn" onClick={onClose}>
          Nice!
        </button>
      </div>
    </div>
  )
}
