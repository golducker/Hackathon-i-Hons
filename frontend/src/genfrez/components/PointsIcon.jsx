// "Icon tiền thưởng" dùng chung toàn app — badge "G" đặc (dùng inline cạnh số điểm)
// và ring tiến độ (dùng ở thẻ My points trên Home, viền orange thể hiện % tới tier kế tiếp).
export function PointsBadge({ size = 22 }) {
  return (
    <span
      className="gf-points-badge"
      style={{ width: size, height: size, fontSize: size * 0.55 }}
      aria-hidden="true"
    >
      G
    </span>
  )
}

export function PointsRing({ progress = 0, size = 56 }) {
  const strokeWidth = size * 0.09
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(1, Math.max(0, progress))
  const dash = circumference * clamped

  return (
    <div className="gf-points-ring" style={{ width: size, height: size }} aria-hidden="true">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--gf-white)"
          strokeWidth={strokeWidth}
          opacity="0.35"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--gf-orange)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="gf-points-ring-badge">G</span>
    </div>
  )
}
