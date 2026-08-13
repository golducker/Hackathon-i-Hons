export default function StatusBar() {
  return (
    <div className="gf-status-bar">
      <span>9:41</span>
      <span className="gf-status-bar-icons">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true">
          <rect x="0" y="7" width="3" height="5" rx="0.5" />
          <rect x="5" y="5" width="3" height="7" rx="0.5" />
          <rect x="10" y="3" width="3" height="9" rx="0.5" />
          <rect x="15" y="0" width="3" height="12" rx="0.5" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden="true">
          <path d="M8 10.5a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6Z" />
          <path d="M8 7.2c1.4 0 2.7.5 3.7 1.4l-1.4 1.4A3.6 3.6 0 0 0 8 9c-.9 0-1.7.3-2.3.9L4.3 8.6A5.6 5.6 0 0 1 8 7.2Z" />
          <path d="M8 3.6c2.4 0 4.6.9 6.3 2.5l-1.4 1.4A6.9 6.9 0 0 0 8 5.8c-1.9 0-3.6.7-4.9 1.9L1.7 6.1A9 9 0 0 1 8 3.6Z" />
        </svg>
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="20" height="11" rx="2.5" stroke="currentColor" />
          <rect x="2" y="2" width="17" height="8" rx="1.5" fill="currentColor" />
          <rect x="21.5" y="4" width="1.5" height="4" rx="0.75" fill="currentColor" />
        </svg>
      </span>
    </div>
  )
}
