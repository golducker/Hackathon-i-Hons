import { leaderboard, greenChallenges } from '../mockData'

function fmtScore(n) {
  return n.toLocaleString('vi-VN', { maximumFractionDigits: 0 })
}

export default function CommunityScreen({ userProfile }) {
  // Thay điểm placeholder của 'teo.rides' bằng số dư thật (userProfile.score), rồi
  // xếp lại hạng theo điểm mới — nếu không, khi đổi/nhận điểm ở Vouchers hay Scan,
  // bảng xếp hạng sẽ hiện một con số không khớp với My Score ở Home.
  const liveLeaderboard = leaderboard
    .map((entry) => (entry.nickname === 'teo.rides' ? { ...entry, points: userProfile.score } : entry))
    .sort((a, b) => b.points - a.points)
    .map((entry, index) => ({ ...entry, rank: index + 1 }))

  return (
    <div className="gf-screen">
      <div className="gf-screen-header">
        <h1 className="gf-screen-title">Community</h1>
        <p className="gf-screen-subtitle">Green Leaderboard, ranked by nickname within your circle (BMC §4.1).</p>
      </div>

      <div className="gf-screen-body">
        <p className="gf-group-label">Leaderboard · FPT University</p>
        {liveLeaderboard.map((entry) => (
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
