import StatusBar from './StatusBar'

export default function PhoneFrame({ children, nav }) {
  return (
    <div className="gf-page-outer">
      <div className="gf-phone-frame">
        <StatusBar />
        <div className="gf-phone-scroll">{children}</div>
        {nav}
      </div>
    </div>
  )
}
