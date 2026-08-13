// Toàn bộ dữ liệu hiển thị của bản demo. Component chỉ đọc từ đây, không viết cứng
// chuỗi trong JSX — cho phép đổi nội dung demo mà không đụng vào component nào.

// tier.currentPoints không lưu tĩnh ở đây — GenFreZApp tính lại từ score mỗi lần
// score đổi (đổi voucher / quét chuyến đi), vì thanh tiến độ luôn phải khớp điểm hiện tại.
export const userProfile = {
  name: 'Tèo',
  score: 13667,
  tier: {
    current: 'Silver',
    next: 'Gold',
    nextThreshold: 15000,
  },
}

// `trip` chỉ có ở 2 nhiệm vụ transport (Streak Rider, Green Steps) — trang task của
// chúng vẫn chạy quãng đường/phương tiện mock này qua đúng công thức calculatePoints()
// ở emissions.js để hiện breakdown CO2 tránh được + ẩn dụ cây xanh, y hệt cách Scan
// screen tính. Crew Recruiter không phải hành vi di chuyển nên không có `trip`, trang
// task của nó hiện nội dung referral thay vì breakdown phát thải.
//
// `rewardPoints` là điểm THẬT được cộng khi hoàn thành (khớp số hiển thị trên card ở
// ảnh thiết kế mới — 1.000 / 2.000). Formula ở emissions.js vẫn chạy và hiện đầy đủ để
// giữ tính minh bạch giáo dục (đúng công thức BMC §5.5), nhưng số điểm formula ra rất
// nhỏ (~1-3 điểm/chuyến do hệ số ngân sách thí điểm 0.3) — nếu dùng thẳng số đó làm
// điểm thưởng thì lệch hẳn quy mô với số dư 10.000+ và giá voucher 120-400 điểm. Vì
// vậy breakdown công thức chỉ mang tính minh hoạ "cách tính hoạt động", còn điểm thật
// cộng vào ví lấy từ rewardPoints cố định này.
// `icon` map sang icon lucide-react trong MissionCard.jsx.
export const missions = [
  {
    id: 'streak-rider',
    tag: 'Streak Rider',
    description: 'Keep the streak alive and ride the bus 5 days in a row.',
    icon: 'flame',
    rewardPoints: 1000,
    trip: { distanceKm: 5, replacementVehicle: 'busMarginal', confidenceTier: 'B' },
  },
  {
    id: 'green-steps',
    tag: 'Green Steps',
    description: 'Ditch the wheels, trust your feet. 2km walked = zero emissions, all clout.',
    icon: 'footprints',
    rewardPoints: 500,
    trip: { distanceKm: 2, replacementVehicle: 'walking', confidenceTier: 'B' },
  },
  {
    id: 'crew-recruiter',
    tag: 'Crew Recruiter',
    description: 'Drag 3 friends onboard. More riders, more points for everyone.',
    icon: 'users',
    rewardPoints: 2000,
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

// BMC §4.1 — Green Leaderboard theo trường/quận. `points` của 'teo.rides' chỉ là chỗ
// giữ chỗ — CommunityScreen luôn ghi đè bằng userProfile.score (số dư thật) rồi sắp
// xếp lại thứ hạng, để khớp với My Score ở Home.
//
// Có ~30 người để giống một leaderboard thật (người dùng không mặc định luôn đứng
// #1) — ranks 1-7 đặt tên/điểm tay cho khớp ảnh thiết kế, ranks 8-26 sinh bằng vòng
// lặp (không gõ tay 19 dòng) với điểm giảm dần đều để 10.000 điểm hiện tại của Tèo
// tự nhiên rơi vào khoảng hạng #27 khi CommunityScreen tính lại — nếu điểm Tèo đổi,
// hạng cũng tính lại đúng, không phải số cố định.
const TOP_LEADERBOARD = [
  { nickname: 'Nguyen Minh Duc', org: 'FPT University', points: 24500 },
  { nickname: 'Tran Bao Ngoc', org: 'NEU', points: 22300 },
  { nickname: 'Pham Quang Huy', org: 'Foreign Trade University', points: 21000 },
  { nickname: 'Le Pham Bao Mai', org: 'Foreign Trade University', points: 19800 },
  { nickname: 'Vu Uyen Nhi', org: 'NEU', points: 19750 },
  { nickname: 'Nguyen Bao Linh', org: 'Bách Khoa', points: 19500 },
  { nickname: 'Nguyen Huy Minh', org: 'FPT University', points: 19450 },
]

const FILLER_NAMES = [
  'Tran Minh Khoa', 'Pham Gia Han', 'Do Thuy Duong', 'Hoang Anh Tuan', 'Vo Ngoc Anh',
  'Dang Bao Chau', 'Bui Xuan Mai', 'Ngo Hai Dang', 'Ly Thu Trang', 'Trinh Van Phuc',
  'Cao Yen Nhi', 'Ha Duc Thinh', 'Luu Kim Ngan', 'Phan Quoc Bao', 'Ta Thanh Tam',
  'Nguyen Gia Bao', 'Le Hoang Yen', 'Vu Minh Chau', 'Dinh Thi Lan',
]
const FILLER_ORGS = ['FPT University', 'NEU', 'Bách Khoa', 'Cầu Giấy', 'Foreign Trade University']

const FILLER_LEADERBOARD = FILLER_NAMES.map((nickname, i) => ({
  nickname,
  org: FILLER_ORGS[i % FILLER_ORGS.length],
  points: Math.round(19000 - i * 489),
}))

export const leaderboard = [
  ...TOP_LEADERBOARD,
  ...FILLER_LEADERBOARD,
  { nickname: 'teo.rides', org: 'Bách Khoa', points: 10000 },
]

// Dùng chung bởi CommunityScreen (bục top-3 + danh sách) và ProfileScreen (chỉ cần
// "Your rank") — một chỗ duy nhất thay điểm placeholder + sắp lại hạng, để hai màn
// không lệch nhau nếu logic tính hạng đổi sau này.
export function computeLiveLeaderboard(score) {
  return leaderboard
    .map((entry) => (entry.nickname === 'teo.rides' ? { ...entry, points: score } : entry))
    .sort((a, b) => b.points - a.points)
    .map((entry, index) => ({ ...entry, rank: index + 1 }))
}

// BMC §7.3 — mô phỏng chuyến đi Tier B (GPS + QR động), vì demo chưa có B2G Tier A-2.
export const scanPresets = [
  {
    id: 'bus-08',
    label: 'Bus route 08 — 5km',
    distanceKm: 5,
    replacementVehicle: 'busMarginal',
    confidenceTier: 'B',
  },
  {
    id: 'ebike-tngo',
    label: 'TNGo e-bike — 3km',
    distanceKm: 3,
    replacementVehicle: 'electricMoto',
    confidenceTier: 'B',
  },
  {
    id: 'walk-2km',
    label: 'Walking — 2km',
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
    note: 'Xanh SM, VinBus, TNGo — timestamp and distance supplied by the partner.',
  },
  {
    id: 'A2',
    label: 'A-2 · Hanoi e-ticketing',
    confidence: '1.0',
    note: 'Tap-in/tap-out, requires a B2G agreement — not signed yet, roadmap month 7–12.',
  },
  {
    id: 'B',
    label: 'B · GPS + dynamic QR',
    confidence: '0.6–0.8',
    note: 'What this demo currently uses.',
  },
  {
    id: 'C',
    label: 'C · Self-report + photo',
    confidence: '0.2',
    note: 'Self-reported, discounted the most heavily to resist gaming.',
  },
]

// Thẻ "Statistics · This week" ở Profile — snapshot tĩnh cho demo (không cộng dồn
// từ history thật), vì một phiên demo chỉ kéo dài vài phút không thể tự có đủ dữ
// liệu trải suốt 7 ngày để vẽ biểu đồ có ý nghĩa.
export const weeklyStats = {
  days: [
    { label: 'Mon', km: 2.84 },
    { label: 'Tue', km: 6.17 },
    { label: 'Wed', km: 4.32 },
    { label: 'Thu', km: 7.05 },
    { label: 'Fri', km: 3.26 },
    { label: 'Sat', km: 8.11 },
    { label: 'Sun', km: 4.92 },
  ],
  pointsAchieved: 580,
}
