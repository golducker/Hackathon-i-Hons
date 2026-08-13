// Toàn bộ dữ liệu hiển thị của bản demo. Component chỉ đọc từ đây, không viết cứng
// chuỗi trong JSX — cho phép đổi nội dung demo mà không đụng vào component nào.

// tier.currentPoints không lưu tĩnh ở đây — GenFreZApp tính lại từ score mỗi lần
// score đổi (đổi voucher / quét chuyến đi), vì thanh tiến độ luôn phải khớp điểm hiện tại.
export const userProfile = {
  name: 'Tèo',
  score: 10000,
  tier: {
    current: 'Silver',
    next: 'Gold',
    nextThreshold: 12000,
  },
}

// BMC §4.1 — "the users who invite the most people in each area" + 3 nhiệm vụ mẫu
// khớp với ảnh thiết kế Home.png (khối MISSIONS phương án 1).
export const missions = [
  {
    id: 'streak-rider',
    tag: 'Streak Rider',
    description: 'Keep the streak alive and ride the bus 5 days in a row.',
    rewardPoints: 150,
  },
  {
    id: 'green-steps',
    tag: 'Green Steps',
    description: 'Ditch the wheels, trust your feet. 2km walked = zero emissions, all clout.',
    rewardPoints: 60,
  },
  {
    id: 'crew-recruiter',
    tag: 'Crew Recruiter',
    description: 'Drag 3 friends onboard. More riders, more points for everyone.',
    rewardPoints: 300,
  },
]

// BMC §4.1 — "Green Challenges run weekly or monthly ... funded by the sponsoring partner."
// Đây là phương án thiết kế thứ 2 trong ảnh (khối tối, viên thuốc teal, linh vật cầm loa),
// tách riêng khỏi Missions phía trên, không lặp lại nội dung.
export const greenChallenges = [
  {
    id: 'no-motorbike-week',
    title: 'No-Motorbike Week',
    sponsor: 'Sponsored by Xanh SM',
    description: 'Zero motorbike trips for 7 days straight. Big badge, bigger bragging rights.',
  },
  {
    id: 'rainy-day-rider',
    title: 'Rainy Day Rider',
    sponsor: 'Sponsored by VinBus',
    description: 'Take the bus instead of a ride-hail on a rainy commute this week.',
  },
  {
    id: 'campus-carpool',
    title: 'Campus Carpool',
    sponsor: 'Sponsored by TNGo',
    description: 'Share an electric car with 2+ classmates on the way to campus.',
  },
]

// BMC §5, §7.6 — Group 1 (transport) bị gate theo lịch sử giao dịch 90 ngày,
// Group 2 (F&B/retail) không bị gate, chỉ là điểm đến để tiêu điểm.
export const vouchers = [
  {
    id: 'xanhsm-first-trip',
    group: '1',
    partner: 'Xanh SM Bike',
    title: 'First-trip discount 20,000đ',
    costPoints: 400,
    gated: true,
    eligible: true,
    note: 'Only visible if you have not ridden with Xanh SM in the last 90 days.',
  },
  {
    id: 'tngo-bike-pass',
    group: '1',
    partner: 'TNGo',
    title: '3-day public bike pass',
    costPoints: 250,
    gated: true,
    eligible: false,
    note: 'Hidden — you rode with TNGo within the last 90 days.',
  },
  {
    id: 'highlands-10off',
    group: '2',
    partner: 'Highlands Coffee',
    title: '10% off any drink',
    costPoints: 300,
    gated: false,
    eligible: true,
    note: 'Catalogue position paid by Highlands, no transaction history check.',
  },
  {
    id: 'circlek-snack',
    group: '2',
    partner: 'Circle K',
    title: '15,000đ off a snack combo',
    costPoints: 150,
    gated: false,
    eligible: true,
    note: 'Everyday reward, matches student spending habits.',
  },
  {
    id: 'gs25-drink',
    group: '2',
    partner: 'GS25',
    title: 'Buy 1 get 1 iced tea',
    costPoints: 120,
    gated: false,
    eligible: true,
    note: 'Most-redeemed category among student users.',
  },
]

// BMC §4.1 — Green Leaderboard theo trường/quận, dưới nickname.
export const leaderboard = [
  { rank: 1, nickname: 'lanh.ne', org: 'FPT University', points: 4820 },
  { rank: 2, nickname: 'binh_moto0', org: 'NEU', points: 4310 },
  { rank: 3, nickname: 'teo.rides', org: 'Bách Khoa', points: 1000 },
  { rank: 4, nickname: 'xanh_hanoi', org: 'Cầu Giấy', points: 860 },
  { rank: 5, nickname: 'may_bus_08', org: 'FPT University', points: 705 },
]

// BMC §7.3 — mô phỏng chuyến đi Tier B (GPS + QR động), vì demo chưa có B2G Tier A-2.
export const scanPresets = [
  {
    id: 'bus-08',
    label: 'Xe buýt tuyến 08 — 5km',
    distanceKm: 5,
    replacementVehicle: 'busMarginal',
    confidenceTier: 'B',
  },
  {
    id: 'ebike-tngo',
    label: 'Xe đạp điện TNGo — 3km',
    distanceKm: 3,
    replacementVehicle: 'electricMoto',
    confidenceTier: 'B',
  },
  {
    id: 'walk-2km',
    label: 'Đi bộ — 2km',
    distanceKm: 2,
    replacementVehicle: 'walking',
    confidenceTier: 'B',
  },
]

// BMC §7.3 — bảng 4 tầng xác minh, dùng cho legend ở Scan/Profile.
export const verificationTiers = [
  {
    id: 'A1',
    label: 'A-1 · Partner webhook',
    confidence: '1.0',
    note: 'Xanh SM, VinBus, TNGo — timestamp và quãng đường do đối tác cung cấp.',
  },
  {
    id: 'A2',
    label: 'A-2 · Hanoi e-ticketing',
    confidence: '1.0',
    note: 'Tap-in/tap-out, cần B2G — chưa ký, roadmap tháng 7–12.',
  },
  {
    id: 'B',
    label: 'B · GPS + dynamic QR',
    confidence: '0.6–0.8',
    note: 'Đang dùng cho bản demo này.',
  },
  {
    id: 'C',
    label: 'C · Self-report + photo',
    confidence: '0.2',
    note: 'Tự khai báo, chiết khấu nặng nhất để chống gian lận.',
  },
]
