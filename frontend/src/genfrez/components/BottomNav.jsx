import { Home, Ticket, ScanLine, Users, User } from 'lucide-react'
import { playClickSound } from '../sound'

const TABS = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'vouchers', label: 'Vouchers', Icon: Ticket },
  { id: 'scan', label: 'Scan', Icon: ScanLine },
  { id: 'community', label: 'Community', Icon: Users },
  { id: 'profile', label: 'Profile', Icon: User },
]

export default function BottomNav({ activeTab, onSelect }) {
  const handleSelect = (id) => {
    playClickSound()
    onSelect(id)
  }

  return (
    <nav className="gf-bottom-nav">
      {TABS.map(({ id, label, Icon }) =>
        id === 'scan' ? (
          <div key={id} className="gf-nav-scan-wrapper">
            <button
              type="button"
              className="gf-nav-scan"
              aria-label={label}
              aria-current={activeTab === id}
              onClick={() => handleSelect(id)}
            >
              <Icon size={26} />
            </button>
            <span className="gf-nav-scan-label">{label}</span>
          </div>
        ) : (
          <button
            key={id}
            type="button"
            className={`gf-nav-item${activeTab === id ? ' gf-active' : ''}`}
            aria-current={activeTab === id}
            onClick={() => handleSelect(id)}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        )
      )}
    </nav>
  )
}
