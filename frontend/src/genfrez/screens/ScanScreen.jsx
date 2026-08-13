import { useState } from 'react'
import { QrCode, Upload, X } from 'lucide-react'
import { calculatePoints, ADDITIONALITY } from '../emissions'
import { scanPresets } from '../mockData'
import { GreenWinkMascot, EyesDecoration } from '../components/MascotArt'
import { playClickSound } from '../sound'

export default function ScanScreen({ onClaim, onClose }) {
  // Mặc định chọn sẵn preset đầu tiên để bấm khung QR/nút Upload là chạy được ngay,
  // không bắt buộc phải chọn preset trước như bản cũ.
  const [selectedPreset, setSelectedPreset] = useState(scanPresets[0])
  const [result, setResult] = useState(null)
  const [claimed, setClaimed] = useState(false)

  const runScan = (preset) => {
    setSelectedPreset(preset)
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

  const handleScanFrame = () => {
    playClickSound()
    runScan(selectedPreset)
  }

  const handlePresetChip = (preset) => {
    playClickSound()
    runScan(preset)
  }

  const handleClose = () => {
    playClickSound()
    onClose()
  }

  const handleClaim = () => {
    playClickSound()
    if (!result || claimed) return
    onClaim(selectedPreset, result)
    setClaimed(true)
  }

  return (
    <div className="gf-screen">
      <div className="gf-scan-header">
        <button type="button" className="gf-scan-close" aria-label="Close scan" onClick={handleClose}>
          <X size={20} strokeWidth={3} />
        </button>
        <h1 className="gf-scan-header-title">Scan QR Code</h1>
        <p className="gf-scan-header-desc">
          Scan the QR code at the bus stop to start tracking your green journey. The QR code refreshes
          every 30 seconds.
        </p>
        <EyesDecoration className="gf-scan-eyes" />
      </div>

      <div className="gf-screen-body gf-scan-body">
        <button type="button" className="gf-qr-frame" aria-label={`Simulate scan: ${selectedPreset.label}`} onClick={handleScanFrame}>
          <span className="gf-qr-corner gf-qr-corner-tl" />
          <span className="gf-qr-corner gf-qr-corner-tr" />
          <span className="gf-qr-corner gf-qr-corner-bl" />
          <span className="gf-qr-corner gf-qr-corner-br" />
          <span className="gf-qr-frame-hint">
            <QrCode size={56} strokeWidth={1.2} />
            <span className="gf-qr-frame-hint-label">
              {result ? `Scanned: ${selectedPreset.label}` : `Tap to scan · ${selectedPreset.label}`}
            </span>
          </span>
        </button>

        <div className="gf-scan-preset-chips">
          {scanPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`gf-scan-chip${selectedPreset.id === preset.id ? ' gf-active' : ''}`}
              onClick={() => handlePresetChip(preset)}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <button type="button" className="gf-scan-upload-btn" onClick={handleScanFrame}>
          <span>Upload from gallery</span>
          <Upload size={18} />
        </button>

        <GreenWinkMascot className="gf-scan-mascot" />

        {result && (
          <div className="gf-scan-result">
            {result.steps.map((step) => (
              <div key={step.label} className="gf-scan-step-row">
                <span>{step.label}</span>
                <span>{step.value}</span>
              </div>
            ))}
            <div className="gf-scan-total">
              +{result.points.toFixed(2)} points (≈ {Math.round(result.voucherValueVnd)}đ)
            </div>
            <button type="button" className="gf-voucher-btn" disabled={claimed} onClick={handleClaim}>
              {claimed ? 'Added to your score' : 'Claim points'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
