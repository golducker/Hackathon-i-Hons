import { useState } from 'react'
import './genfrez.css'
import PhoneFrame from './components/PhoneFrame'
import BottomNav from './components/BottomNav'
import HomeScreen from './screens/HomeScreen'
import VouchersScreen from './screens/VouchersScreen'
import ScanScreen from './screens/ScanScreen'
import CommunityScreen from './screens/CommunityScreen'
import ProfileScreen from './screens/ProfileScreen'
import { userProfile as initialProfile } from './mockData'

export default function GenFreZApp() {
  const [activeTab, setActiveTab] = useState('home')
  // Điểm dùng chung giữa Home (My Score), Vouchers (đổi điểm) và Scan (nhận điểm) —
  // đặt ở gốc app vì cả ba màn đều cần đọc/ghi cùng một số dư.
  const [score, setScore] = useState(initialProfile.score)

  const userProfile = { ...initialProfile, score }

  const spendPoints = (amount) => setScore((s) => Math.max(0, s - amount))
  const earnPoints = (amount) => setScore((s) => s + amount)

  let screen
  switch (activeTab) {
    case 'vouchers':
      screen = <VouchersScreen balance={score} onRedeem={spendPoints} />
      break
    case 'scan':
      screen = <ScanScreen onEarnPoints={earnPoints} />
      break
    case 'community':
      screen = <CommunityScreen userProfile={userProfile} />
      break
    case 'profile':
      screen = <ProfileScreen userProfile={userProfile} />
      break
    case 'home':
    default:
      screen = <HomeScreen userProfile={userProfile} onEarnPoints={earnPoints} />
  }

  return (
    <PhoneFrame nav={<BottomNav activeTab={activeTab} onSelect={setActiveTab} />}>
      {screen}
    </PhoneFrame>
  )
}
