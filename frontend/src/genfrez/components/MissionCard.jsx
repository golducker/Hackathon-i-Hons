import { Check, ChevronRight, Flame, Footprints, Users } from 'lucide-react'
import { PointsBadge } from './PointsIcon'
import { playClickSound } from '../sound'

const ICONS = { flame: Flame, footprints: Footprints, users: Users }

export default function MissionCard({ mission, completed, onOpen }) {
  const Icon = ICONS[mission.icon] ?? Flame

  const handleClick = () => {
    playClickSound()
    onOpen?.(mission)
  }

  return (
    <button
      type="button"
      className={`gf-mission-card-v2${completed ? ' gf-mission-card-v2-done' : ''}`}
      onClick={handleClick}
    >
      <div className="gf-mission-card-v2-top">
        <span className="gf-mission-card-v2-back" aria-hidden="true">
          {completed ? <Check size={14} strokeWidth={3} /> : <ChevronRight size={14} strokeWidth={3} />}
        </span>
        <span className="gf-mission-card-v2-points">
          <PointsBadge size={16} />
          {mission.rewardPoints.toLocaleString('vi-VN')}
        </span>
      </div>
      <Icon size={48} strokeWidth={1.2} className="gf-mission-card-v2-icon" />
      <span className="gf-mission-card-v2-title">{mission.tag}</span>
    </button>
  )
}
