import { useState } from 'react'
import { QrCode } from 'lucide-react'
import { calculatePoints, ADDITIONALITY } from '../emissions'
import { scanPresets } from '../mockData'

export default function ScanScreen({ onEarnPoints }) {
  const [selectedId, setSelectedId] = useState(null)
  const [result, setResult] = useState(null)
  const [claimed, setClaimed] = useState(false)

  const runScan = (preset) => {
    setSelectedId(preset.id)
    setClaimed(false)
    // BMC §7.3: bản demo chạy hoàn toàn ở tầng B (GPS + QR động), chưa có B2G Tier A-2.
    // Hệ số bổ sung dùng mức người dùng mới (0.7) vì demo không có lịch sử 90 ngày thật.
    const calc = calculatePoints({
      distanceKm: preset.distanceKm,
      baselineVehicle: 'petrolMoto',
      replacementVehicle: preset.replacementVehicle,
      confidenceTier: preset.confidenceTier,
      additionality: ADDITIONALITY.NEW_USER,
    })
    setResult(calc)
  }

  const handleClaim = () => {
    if (!result || claimed) return
    onEarnPoints(result.points)
    setClaimed(true)
  }

  return (
    <div className="gf-screen">
      <div className="gf-screen-header">
        <h1 className="gf-screen-title">Scan</h1>
        <p className="gf-screen-subtitle">Simulate a Tier B check-in — GPS + dynamic QR, no camera needed for the demo.</p>
      </div>

      <div className="gf-screen-body">
        <div className="gf-scan-frame" aria-hidden="true">
          <QrCode size={100} strokeWidth={1.5} />
        </div>

        <p className="gf-group-label">Pick a trip to simulate</p>
        <div className="gf-scan-preset-list">
          {scanPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`gf-scan-preset-btn${selectedId === preset.id ? ' gf-active' : ''}`}
              onClick={() => runScan(preset)}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {result && (
          <div className="gf-scan-result">
            {result.steps.map((step) => (
              <div key={step.label} className="gf-scan-step-row">
                <span>{step.label}</span>
                <span>{step.value}</span>
              </div>
            ))}
            <div className="gf-scan-total">+{result.points.toFixed(2)} points (≈ {Math.round(result.voucherValueVnd)}đ)</div>
            <button
              type="button"
              className="gf-voucher-btn"
              disabled={claimed}
              onClick={handleClaim}
            >
              {claimed ? 'Added to your score' : 'Claim points'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
