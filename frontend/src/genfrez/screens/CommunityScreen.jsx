import { useState } from 'react'
import { leaderboard, greenChallenges } from '../mockData'
import { OrangeWavyMascot, HeartMascot, PinkSquareWaveMascot } from '../components/MascotArt'
import { playClickSound } from '../sound'

function fmtScore(n) {
  return n.toLocaleString('vi-VN', { maximumFractionDigits: 0 })
}

// Nhãn phạm vi lọc BMC §4.1 ("ranks users by district, university or workplace") —
// demo chỉ có 5 dòng mock nên bấm đổi tab không lọc lại dữ liệu thật, chỉ đổi trạng
// thái hiển thị đang chọn tab nào (đủ minh hoạ ý tưởng, không giả vờ có dữ liệu thật).
const SCOPES = ['Hanoi', 'Foreign Trade University']

const PODIUM_MASCOTS = {
  1: HeartMascot,
  2: OrangeWavyMascot,
  3: PinkSquareWaveMascot,
}

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

export default function CommunityScreen({ userProfile }) {
  const [scope, setScope] = useState(SCOPES[0])

  // Thay điểm placeholder của 'teo.rides' bằng số dư thật (userProfile.score), rồi
  // xếp lại hạng theo điểm mới — nếu không, khi đổi/nhận điểm ở Vouchers hay Scan,
  // bảng xếp hạng sẽ hiện một con số không khớp với My Score ở Home.
  const liveLeaderboard = leaderboard
    .map((entry) => (entry.nickname === 'teo.rides' ? { ...entry, points: userProfile.score } : entry))
    .sort((a, b) => b.points - a.points)
    .map((entry, index) => ({ ...entry, rank: index + 1 }))

  const yourRank = liveLeaderboard.find((entry) => entry.nickname === 'teo.rides')?.rank
  const top3 = liveLeaderboard.slice(0, 3)
  const rest = liveLeaderboard.slice(3)
  const [second, first, third] = [top3[1], top3[0], top3[2]]

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
            Your rank: <strong>#{yourRank}</strong>
          </span>
        </div>
        <h1 className="gf-leaderboard-title">Leaderboard</h1>

        <div className="gf-podium">
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

        {rest.map((entry) => (
          <div
            key={entry.nickname}
            className="gf-leaderboard-row"
            style={entry.nickname === 'teo.rides' ? { outline: '2px solid var(--gf-orange)' } : undefined}
          >
            <span className="gf-rank-badge">{entry.rank}</span>
            <div className="gf-leaderboard-info">
              <div className="gf-leaderboard-nickname">
                {entry.nickname}
                {entry.nickname === 'teo.rides' ? ` (${userProfile.name})` : ''}
              </div>
              <div className="gf-leaderboard-org">{entry.org}</div>
            </div>
            <span className="gf-leaderboard-points">{fmtScore(entry.points)}</span>
          </div>
        ))}

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
