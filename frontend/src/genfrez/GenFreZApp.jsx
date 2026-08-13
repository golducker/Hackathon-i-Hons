import { useState } from 'react'
import './genfrez.css'
import PhoneFrame from './components/PhoneFrame'
import BottomNav from './components/BottomNav'
import HomeScreen from './screens/HomeScreen'
import VouchersScreen from './screens/VouchersScreen'
import ScanScreen from './screens/ScanScreen'
import CommunityScreen from './screens/CommunityScreen'
import ProfileScreen from './screens/ProfileScreen'
import TaskDetailScreen from './screens/TaskDetailScreen'
import HistoryScreen from './screens/HistoryScreen'
import MyVouchersScreen from './screens/MyVouchersScreen'
import { userProfile as initialProfile, missions, vouchers } from './mockData'
import { generateRedemption } from './redemption'

let historyIdSeq = 0
function nextHistoryId() {
  historyIdSeq += 1
  return `h${historyIdSeq}`
}

export default function GenFreZApp() {
  const [activeTab, setActiveTab] = useState('home')
  // Trang "pushed" — điều hướng ra ngoài 5 tab dưới (task nhiệm vụ, History, Your
  // rewards), có nút quay lại thay vì nằm trong thanh tab. null = đang ở một trong 5 tab.
  const [pushedScreen, setPushedScreen] = useState(null)

  // Điểm, log lịch sử, tiến độ nhiệm vụ và voucher đã đổi đều sống ở đây (không phải
  // trong từng screen) vì GenFreZApp chỉ mount một screen tại một thời điểm — nếu để
  // state trong HomeScreen/VouchersScreen, đổi tab rồi quay lại sẽ mất hết tiến độ.
  const [score, setScore] = useState(initialProfile.score)
  const [history, setHistory] = useState([])
  const [missionResults, setMissionResults] = useState({})
  const [redeemedVouchers, setRedeemedVouchers] = useState({})

  const userProfile = { ...initialProfile, score }

  const addHistory = (entry) => {
    setHistory((h) => [{ id: nextHistoryId(), timestamp: Date.now(), ...entry }, ...h])
  }

  const handleSelectTab = (tabId) => {
    setPushedScreen(null)
    setActiveTab(tabId)
  }

  const navigateTo = (screen) => setPushedScreen(screen)
  const goBackHome = () => setPushedScreen(null)

  const completeMission = (mission, points) => {
    if (missionResults[mission.id]) return
    setScore((s) => s + points)
    setMissionResults((prev) => ({ ...prev, [mission.id]: { points, completedAt: Date.now() } }))
    addHistory({
      type: 'mission',
      title: `Mission completed — ${mission.tag}`,
      detail: mission.trip ? `${mission.trip.distanceKm}km green-transport trip` : 'Referral mission',
      pointsDelta: points,
    })
  }

  const redeemVoucher = (voucher) => {
    if (redeemedVouchers[voucher.id] || score < voucher.costPoints) return
    const redemption = generateRedemption(voucher)
    setScore((s) => Math.max(0, s - voucher.costPoints))
    setRedeemedVouchers((prev) => ({ ...prev, [voucher.id]: redemption }))
    addHistory({
      type: 'redeem',
      title: `Redeemed — ${voucher.title}`,
      detail: voucher.partner,
      pointsDelta: -voucher.costPoints,
    })
  }

  const markVoucherUsed = (voucherId) => {
    setRedeemedVouchers((prev) =>
      prev[voucherId] ? { ...prev, [voucherId]: { ...prev[voucherId], usedAt: Date.now() } } : prev
    )
    const voucher = vouchers.find((v) => v.id === voucherId)
    addHistory({
      type: 'voucher_used',
      title: `Used — ${voucher?.title ?? voucherId}`,
      detail: voucher?.partner ?? '',
      pointsDelta: 0,
    })
  }

  const claimScanPoints = (preset, calc) => {
    setScore((s) => s + calc.points)
    addHistory({
      type: 'scan',
      title: `Scan check-in — ${preset.label}`,
      detail: `${calc.points.toFixed(2)} pts from ${preset.distanceKm}km`,
      pointsDelta: calc.points,
    })
  }

  let screen
  if (pushedScreen?.type === 'task') {
    const mission = missions.find((m) => m.id === pushedScreen.missionId)
    screen = (
      <TaskDetailScreen
        mission={mission}
        completed={Boolean(missionResults[mission.id])}
        onComplete={(points) => completeMission(mission, points)}
        onBack={goBackHome}
      />
    )
  } else if (pushedScreen?.type === 'history') {
    screen = <HistoryScreen history={history} onBack={goBackHome} />
  } else if (pushedScreen?.type === 'my-vouchers') {
    screen = (
      <MyVouchersScreen redeemedVouchers={redeemedVouchers} onMarkUsed={markVoucherUsed} onBack={goBackHome} />
    )
  } else {
    switch (activeTab) {
      case 'vouchers':
        screen = (
          <VouchersScreen
            balance={score}
            redeemedVouchers={redeemedVouchers}
            onRedeem={redeemVoucher}
            onViewMyVouchers={() => navigateTo({ type: 'my-vouchers' })}
          />
        )
        break
      case 'scan':
        screen = <ScanScreen onClaim={claimScanPoints} />
        break
      case 'community':
        screen = <CommunityScreen userProfile={userProfile} />
        break
      case 'profile':
        screen = <ProfileScreen userProfile={userProfile} />
        break
      case 'home':
      default:
        screen = (
          <HomeScreen
            userProfile={userProfile}
            missionResults={missionResults}
            onOpenMission={(mission) => navigateTo({ type: 'task', missionId: mission.id })}
            onNavigate={navigateTo}
            onSelectTab={handleSelectTab}
          />
        )
    }
  }

  return (
    <PhoneFrame nav={<BottomNav activeTab={pushedScreen ? null : activeTab} onSelect={handleSelectTab} />}>
      {screen}
    </PhoneFrame>
  )
}
