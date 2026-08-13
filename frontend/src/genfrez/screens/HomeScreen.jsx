import { Calendar, ChevronRight, Gift, Search } from 'lucide-react'
import MissionCard from '../components/MissionCard'
import { PinkBlobMascot, CoralMegaphoneMascot } from '../components/MascotArt'
import { PointsRing } from '../components/PointsIcon'
import { missions, greenChallenges } from '../mockData'
import { playClickSound } from '../sound'

function fmtScore(n) {
  return n.toLocaleString('vi-VN', { maximumFractionDigits: 0 })
}

export default function HomeScreen({ userProfile, missionResults, onOpenMission, onNavigate, onSelectTab }) {
  const { name, score, tier } = userProfile
  const progressFraction = score / tier.nextThreshold
  const remaining = Math.max(0, tier.nextThreshold - score)

  const goToVouchers = () => {
    playClickSound()
    onSelectTab('vouchers')
  }

  const goToProfile = () => {
    playClickSound()
    onSelectTab('profile')
  }

  const openHistory = () => {
    playClickSound()
    onNavigate({ type: 'history' })
  }

  const openMyVouchers = () => {
    playClickSound()
    onNavigate({ type: 'my-vouchers' })
  }

  return (
    <>
      <header className="gf-header">
        <div className="gf-header-row">
          <span className="gf-logo">GenFreZ</span>
          <button type="button" className="gf-avatar" aria-label="Open profile" onClick={goToProfile}>
            <PinkBlobMascot className="gf-avatar-mascot" />
          </button>
        </div>
        <p className="gf-greeting">Hello, {name}!</p>

        <button type="button" className="gf-points-card" onClick={goToProfile}>
          <PointsRing progress={progressFraction} size={56} />
          <div className="gf-points-card-body">
            <span className="gf-points-card-label">My points</span>
            <span className="gf-points-card-value">
              {fmtScore(score)} <span className="gf-points-card-value-muted">/ {fmtScore(tier.nextThreshold)}</span>
            </span>
            <p className="gf-points-card-caption">
              {remaining > 0 ? (
                <>
                  <strong>{fmtScore(remaining)}</strong> more points and <strong>{tier.next}</strong> is yours!
                </>
              ) : (
                <strong>You reached {tier.next}!</strong>
              )}
            </p>
          </div>
          <ChevronRight className="gf-points-card-chevron" size={22} strokeWidth={3} aria-hidden="true" />
        </button>

        <div className="gf-quick-actions">
          <button type="button" className="gf-quick-action" onClick={openHistory}>
            <Calendar size={22} />
            <span>History</span>
          </button>
          <button type="button" className="gf-quick-action" onClick={goToVouchers}>
            <Search size={22} />
            <span>Explore rewards</span>
          </button>
          <button type="button" className="gf-quick-action" onClick={openMyVouchers}>
            <Gift size={22} />
            <span>Your rewards</span>
          </button>
        </div>

        <button type="button" className="gf-deals-banner" onClick={goToVouchers}>
          <div className="gf-deals-banner-orange">
            <p className="gf-deals-banner-kicker">Discover today&apos;s</p>
            <p className="gf-deals-banner-title">TOP DEALS</p>
            <p className="gf-deals-banner-sub">Grab a deal and grow your points.</p>
            <span className="gf-deals-banner-cta">Check out now</span>
          </div>
          <PinkBlobMascot className="gf-deals-banner-mascot" />
        </button>
      </header>

      <div className="gf-body">
        <div className="gf-section-title-row">
          <CoralMegaphoneMascot className="gf-section-mascot" />
          <h2 className="gf-section-title-left">Missions</h2>
        </div>
        <div className="gf-mission-grid">
          {missions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              completed={Boolean(missionResults[mission.id])}
              onOpen={onOpenMission}
            />
          ))}
        </div>

        <h2 className="gf-section-title">Green Challenges</h2>
        <GreenChallengesCard />
      </div>
    </>
  )
}

function GreenChallengesCard() {
  return (
    <div className="gf-challenges-card">
      {greenChallenges.map((challenge) => (
        <ChallengePill key={challenge.id} challenge={challenge} />
      ))}
      <CoralMegaphoneMascot className="gf-mascot" />
    </div>
  )
}

function ChallengePill({ challenge }) {
  return (
    <details className="gf-challenge-details">
      <summary
        className="gf-challenge-pill"
        onClick={() => playClickSound()}
      >
        <span className="gf-challenge-title">{challenge.title}</span>
        <span className="gf-challenge-arrow" aria-hidden="true">
          ›
        </span>
      </summary>
      <p className="gf-challenge-detail">
        {challenge.sponsor} — {challenge.description}
      </p>
    </details>
  )
}
