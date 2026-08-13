import { useState } from 'react'
import { leaderboard, greenChallenges } from '../mockData'
import { OrangeWavyMascot, HeartMascot, PinkSquareWaveMascot, SparkleDecoration } from '../components/MascotArt'
import { playClickSound } from '../sound'

function fmtPoints(n) {
  return `${Math.round(n).toLocaleString('en-US')} pts`
}

// Nhãn phạm vi lọc BMC §4.1 ("ranks users by district, university or workplace") —
// demo chỉ có dữ liệu mock nên bấm đổi tab không lọc lại dữ liệu thật, chỉ đổi trạng
// thái hiển thị đang chọn tab nào (đủ minh hoạ ý tưởng, không giả vờ có dữ liệu thật).
const SCOPES = ['Hanoi', 'Foreign Trade University']

const PODIUM_MASCOTS = {
  1: HeartMascot,
  2: OrangeWavyMascot,
  3: PinkSquareWaveMascot,
}

// Sắc độ hàng xếp hạng nhạt dần từ #4 xuống #7, giống dải màu trong ảnh thiết kế.
const ROW_SHADES = ['#2a93ad', '#3f8fa4', '#557f96', '#6c7f89']
const YOUR_ROW_SHADE = '#7c98a3'

function PodiumSlot({ entry, tall }) {
  const Mascot = PODIUM_MASCOTS[entry.rank]
  return (
    <div className={`gf-podium-slot${tall ? ' gf-podium-slot-tall' : ''}`}>
      <div className="gf-podium-avatar">
        <Mascot className="gf-podium-avatar-mascot" />
      </div>
      <div className="gf-podium-name">{entry.nickname}</div>
      <div className="gf-podium-org">{entry.org}</div>
      <div className="gf-podium-rank-chip">#{entry.rank}</div>
    </div>
  )
}

function LeaderboardRow({ entry, shade, isYou, youName }) {
  return (
    <div className="gf-leaderboard-row" style={{ background: shade }}>
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

  // Thay điểm placeholder của 'teo.rides' bằng số dư thật (userProfile.score), rồi
  // xếp lại hạng theo điểm mới trên toàn bộ ~30 người trong mockData.leaderboard —
  // nếu điểm đổi ở Vouchers/Scan/Missions, hạng ở đây tính lại đúng theo, không phải
  // số cố định.
  const liveLeaderboard = leaderboard
    .map((entry) => (entry.nickname === 'teo.rides' ? { ...entry, points: userProfile.score } : entry))
    .sort((a, b) => b.points - a.points)
    .map((entry, index) => ({ ...entry, rank: index + 1 }))

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
          <SparkleDecoration className="gf-sparkle gf-sparkle-1" />
          <SparkleDecoration className="gf-sparkle gf-sparkle-2" />
          <SparkleDecoration className="gf-sparkle gf-sparkle-3" />
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
          <LeaderboardRow key={entry.nickname} entry={entry} shade={ROW_SHADES[i]} isYou={false} />
        ))}

        {showYouSeparately && (
          <>
            <div className="gf-leaderboard-gap" aria-hidden="true">
              ⋯
            </div>
            <LeaderboardRow entry={yourEntry} shade={YOUR_ROW_SHADE} isYou youName={userProfile.name} />
          </>
        )}

        <p className="gf-group-label">Active Green Challenges</p>
        {greenChallenges.map((challenge) => (
          <div key={challenge.id} className="gf-voucher-card">
            <div className="gf-voucher-title">{challenge.title}</div>
            <p className="gf-voucher-note">
              {challenge.sponsor} — {challenge.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
