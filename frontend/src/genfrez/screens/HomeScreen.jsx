import { Calendar, ChevronRight, Gift, Search } from 'lucide-react'
import MissionCard from '../components/MissionCard'
import Mascot from '../components/Mascot'
import Reveal from '../components/Reveal'
import { PointsRing } from '../components/PointsIcon'
import { missions, greenChallenges } from '../mockData'
import { useCountUp } from '../hooks'
import { playClickSound } from '../sound'

function fmtScore(n) {
  return n.toLocaleString('vi-VN', { maximumFractionDigits: 0 })
}

export default function HomeScreen({ userProfile, missionResults, onOpenMission, onNavigate, onSelectTab }) {
  const { name, score, tier } = userProfile
  // Điểm hiển thị "chạy" tới số thật — vòng tiến độ cũng đọc số đang chạy này nên
  // vòng cam quét dần theo con số.
  const shownScore = useCountUp(score, { key: 'home-score', duration: 1400 })
  const progressFraction = shownScore / tier.nextThreshold
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

  const quickActions = [
    { label: 'History', Icon: Calendar, onClick: openHistory },
    { label: 'Explore rewards', Icon: Search, onClick: goToVouchers },
    { label: 'Your rewards', Icon: Gift, onClick: openMyVouchers },
  ]

  return (
    <>
      <header className="gf-header gf-home-header">
        <div className="gf-header-row">
          <span className="gf-logo gf-logo-parallax">GenFreZ</span>
          <button type="button" className="gf-avatar" aria-label="Open profile" onClick={goToProfile}>
            <Mascot name="fluffy-scared" idle="none" className="gf-avatar-mascot" />
          </button>
        </div>
        <p className="gf-greeting">
          Hello, <span className="gf-greeting-name">{name}</span>!
        </p>

        <Reveal variant="pop">
          <button type="button" className="gf-points-card gf-shine-sweep" onClick={goToProfile}>
            <PointsRing progress={progressFraction} size={56} />
            <div className="gf-points-card-body">
              <span className="gf-points-card-label">My points</span>
              <span className="gf-points-card-value">
                {fmtScore(shownScore)}{' '}
                <span className="gf-points-card-value-muted">/ {fmtScore(tier.nextThreshold)}</span>
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
        </Reveal>

        <div className="gf-quick-actions">
          {quickActions.map(({ label, Icon, onClick }, i) => (
            <Reveal key={label} delay={120 + i * 80} className="gf-quick-action-cell">
              <button type="button" className="gf-quick-action" onClick={onClick}>
                <Icon size={22} className="gf-quick-action-icon" />
                <span>{label}</span>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal delay={260}>
          <button type="button" className="gf-deals-banner" onClick={goToVouchers}>
            <span className="gf-deals-banner-dots" aria-hidden="true" />
            <div className="gf-deals-banner-orange">
              <p className="gf-deals-banner-kicker">Discover today&apos;s</p>
              <p className="gf-deals-banner-title">TOP DEALS</p>
              <p className="gf-deals-banner-sub">Grab a deal and grow your points.</p>
              <span className="gf-deals-banner-cta">
                Check out now <ChevronRight size={14} strokeWidth={3} aria-hidden="true" />
              </span>
            </div>
            <span className="gf-deals-banner-mascot-parallax">
              <Mascot name="fluffy-scared" className="gf-deals-banner-mascot" />
            </span>
          </button>
        </Reveal>
      </header>

      <div className="gf-body gf-body-clouds">
        <Reveal variant="left" className="gf-section-title-row">
          <Mascot name="megaphone" className="gf-section-mascot" />
          <h2 className="gf-section-title-left">Missions</h2>
        </Reveal>
        <div className="gf-mission-grid">
          {missions.map((mission, i) => (
            <Reveal key={mission.id} delay={i * 90} variant="pop" className="gf-mission-cell">
              <MissionCard mission={mission} completed={Boolean(missionResults[mission.id])} onOpen={onOpenMission} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <h2 className="gf-section-title">Green Challenges</h2>
        </Reveal>
        <Reveal delay={80}>
          <GreenChallengesCard />
        </Reveal>
      </div>
    </>
  )
}

function GreenChallengesCard() {
  return (
    <div className="gf-challenges-card">
      {greenChallenges.map((challenge, i) => (
        <Reveal key={challenge.id} variant="left" delay={150 + i * 110}>
          <ChallengePill challenge={challenge} />
        </Reveal>
      ))}
      <Mascot name="megaphone" className="gf-mascot" />
    </div>
  )
}

function ChallengePill({ challenge }) {
  return (
    <details className="gf-challenge-details">
      <summary className="gf-challenge-pill" onClick={() => playClickSound()}>
        <span className="gf-challenge-title">{challenge.title}</span>
        <span className="gf-challenge-arrow" aria-hidden="true">
          <ChevronRight size={18} strokeWidth={3} />
        </span>
      </summary>
      <p className="gf-challenge-detail">
        {challenge.sponsor} — {challenge.description}
      </p>
    </details>
  )
}
