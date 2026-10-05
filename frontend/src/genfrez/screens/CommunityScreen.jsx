import { useState } from 'react'
import { Crown } from 'lucide-react'
import { computeLiveLeaderboard, greenChallenges } from '../mockData'
import Mascot, { Sparkle } from '../components/Mascot'
import Reveal from '../components/Reveal'
import { playClickSound } from '../sound'

function fmtPoints(n) {
  return `${Math.round(n).toLocaleString('en-US')} pts`
}

// Nhãn phạm vi lọc BMC §4.1 ("ranks users by district, university or workplace") —
// demo chỉ có dữ liệu mock nên bấm đổi tab không lọc lại dữ liệu thật, chỉ đổi trạng
// thái hiển thị đang chọn tab nào (đủ minh hoạ ý tưởng, không giả vờ có dữ liệu thật).
const SCOPES = ['Hanoi', 'Foreign Trade University']

const PODIUM_MASCOTS = {
  1: 'heart-hug',
  2: 'yellow-tongue',
  3: 'square-wave',
}

// Bục mọc lên theo thứ tự kịch tính: hạng 3 → hạng 2 → hạng 1.
const PODIUM_DELAY = { 1: 360, 2: 180, 3: 0 }

// Sắc độ hàng xếp hạng nhạt dần từ #4 xuống #7, giống dải màu trong ảnh thiết kế.
const ROW_SHADES = ['#2a93ad', '#3f8fa4', '#557f96', '#6c7f89']
const YOUR_ROW_SHADE = '#7c98a3'

function PodiumSlot({ entry, tall }) {
  return (
    <div
      className={`gf-podium-slot gf-podium-rank-${entry.rank}${tall ? ' gf-podium-slot-tall' : ''}`}
      style={{ '--rise-delay': `${PODIUM_DELAY[entry.rank]}ms` }}
    >
      {tall && <Crown className="gf-podium-crown" size={26} strokeWidth={2.4} aria-hidden="true" />}
      <div className="gf-podium-avatar">
        <Mascot name={PODIUM_MASCOTS[entry.rank]} className="gf-podium-avatar-mascot" />
      </div>
      <div className="gf-podium-name">{entry.nickname}</div>
      <div className="gf-podium-org">{entry.org}</div>
      <div className="gf-podium-points">{fmtPoints(entry.points)}</div>
      <div className="gf-podium-rank-chip">#{entry.rank}</div>
    </div>
  )
}

function LeaderboardRow({ entry, shade, isYou, youName }) {
  return (
    <div className={`gf-leaderboard-row${isYou ? ' gf-leaderboard-row-you' : ''}`} style={{ background: shade }}>
      <span className="gf-rank-badge">{entry.rank}</span>
      <div className="gf-leaderboard-info">
        <div className="gf-leaderboard-nickname">
          {isYou ? youName : entry.nickname}
          {isYou && <span className="gf-leaderboard-you"> (You)</span>}
        </div>
        <div className="gf-leaderboard-org">{entry.org}</div>
      </div>
      <span className="gf-leaderboard-points">{fmtPoints(entry.points)}</span>
    </div>
  )
}

export default function CommunityScreen({ userProfile }) {
  const [scope, setScope] = useState(SCOPES[0])

  // Thay điểm placeholder của 'teo.rides' bằng số dư thật (userProfile.score) rồi
  // sắp lại hạng trên toàn bộ ~30 người — dùng chung logic với ProfileScreen qua
  // computeLiveLeaderboard() ở mockData.js, để hai màn không lệch nhau.
  const liveLeaderboard = computeLiveLeaderboard(userProfile.score)

  const yourEntry = liveLeaderboard.find((entry) => entry.nickname === 'teo.rides')
  const top3 = liveLeaderboard.slice(0, 3)
  const nearTop = liveLeaderboard.slice(3, 7)
  const [second, first, third] = [top3[1], top3[0], top3[2]]
  // Chỉ hiện hàng "bạn" tách riêng (có khoảng trống ⋯ phía trên) nếu hạng thật của
  // bạn rơi ngoài top 7 — nếu điểm cao lên và lọt top 7 thì đã có sẵn trong nearTop.
  const showYouSeparately = yourEntry && yourEntry.rank > 7

  const handleScope = (s) => {
    playClickSound()
    setScope(s)
  }

  return (
    <div className="gf-screen">
      <div className="gf-leaderboard-header">
        <div className="gf-header-row">
          <span className="gf-logo">GenFreZ</span>
          <span className="gf-leaderboard-rank">
            Your rank: <strong>#{yourEntry?.rank}</strong>
          </span>
        </div>
        <h1 className="gf-leaderboard-title">Leaderboard</h1>

        <div className="gf-podium">
          <span className="gf-podium-spotlight" aria-hidden="true" />
          <Sparkle className="gf-sparkle gf-sparkle-1" />
          <Sparkle className="gf-sparkle gf-sparkle-2" />
          <Sparkle className="gf-sparkle gf-sparkle-3" />
          <Sparkle className="gf-sparkle gf-sparkle-4" />
          {second && <PodiumSlot entry={second} />}
          {first && <PodiumSlot entry={first} tall />}
          {third && <PodiumSlot entry={third} />}
        </div>
      </div>

      <div className="gf-screen-body">
        <div className="gf-leaderboard-filters">
          {SCOPES.map((s) => (
            <button
              key={s}
              type="button"
              className={`gf-filter-pill${scope === s ? ' gf-active' : ''}`}
              onClick={() => handleScope(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {nearTop.map((entry, i) => (
          <Reveal key={entry.nickname} variant="right" delay={i * 70}>
            <LeaderboardRow
              entry={entry}
              shade={ROW_SHADES[i]}
              isYou={entry.nickname === 'teo.rides'}
              youName={userProfile.name}
            />
          </Reveal>
        ))}

        {showYouSeparately && (
          <>
            <div className="gf-leaderboard-gap" aria-hidden="true">
              ⋯
            </div>
            <Reveal variant="pop">
              <LeaderboardRow entry={yourEntry} shade={YOUR_ROW_SHADE} isYou youName={userProfile.name} />
            </Reveal>
          </>
        )}

        <Reveal>
          <p className="gf-group-label">Active Green Challenges</p>
        </Reveal>
        {greenChallenges.map((challenge, i) => (
          <Reveal key={challenge.id} delay={i * 80}>
            <div className="gf-voucher-card gf-challenge-card">
              <div className="gf-voucher-title">{challenge.title}</div>
              <p className="gf-voucher-note">
                {challenge.sponsor} — {challenge.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
