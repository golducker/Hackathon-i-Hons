import { Check, ChevronRight } from 'lucide-react'

export default function MissionCard({ mission, completed, onOpen }) {
  return (
    <div className={`gf-mission-card${completed ? ' gf-mission-card-done' : ''}`}>
      <span className="gf-mission-tag">{mission.tag}</span>
      <p className="gf-mission-desc">{mission.description}</p>
      <button
        type="button"
        className="gf-mission-arrow"
        aria-label={completed ? `${mission.tag} completed — view result` : `Complete ${mission.tag}`}
        onClick={() => onOpen?.(mission)}
      >
        {completed ? <Check size={26} strokeWidth={3} /> : <ChevronRight size={26} strokeWidth={3} />}
      </button>
    </div>
  )
}
