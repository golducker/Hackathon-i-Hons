import { ChevronRight } from 'lucide-react'

export default function MissionCard({ mission, onOpen }) {
  return (
    <div className="gf-mission-card">
      <span className="gf-mission-tag">{mission.tag}</span>
      <p className="gf-mission-desc">{mission.description}</p>
      <button
        type="button"
        className="gf-mission-arrow"
        aria-label={`Open ${mission.tag}`}
        onClick={() => onOpen?.(mission)}
      >
        <ChevronRight size={26} strokeWidth={3} />
      </button>
    </div>
  )
}
