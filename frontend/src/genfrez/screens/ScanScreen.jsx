import { useEffect, useRef, useState } from 'react'
import { QrCode, Upload, X } from 'lucide-react'
import { calculatePoints, ADDITIONALITY } from '../emissions'
import { scanPresets } from '../mockData'
import Mascot from '../components/Mascot'
import { useFx } from '../contexts'
import { playClickSound, playRewardSound } from '../sound'

// Thời gian giả lập "đang quét" — đủ để thấy tia laser chạy nhanh rồi chớp sáng.
const SCAN_MS = 900

export default function ScanScreen({ onClaim, onClose }) {
  const fx = useFx()
  // Mặc định chọn sẵn preset đầu tiên để bấm khung QR/nút Upload là chạy được ngay,
  // không bắt buộc phải chọn preset trước như bản cũ.
  const [selectedPreset, setSelectedPreset] = useState(scanPresets[0])
  const [result, setResult] = useState(null)
  const [claimed, setClaimed] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [scanCount, setScanCount] = useState(0)
  const scanTimer = useRef(null)

  useEffect(() => () => clearTimeout(scanTimer.current), [])

  const runScan = (preset) => {
    setSelectedPreset(preset)
    setClaimed(false)
    setResult(null)
    setScanning(true)
    clearTimeout(scanTimer.current)
    scanTimer.current = setTimeout(() => {
      // BMC §7.3: bản demo chạy hoàn toàn ở tầng B (GPS + QR động), chưa có B2G Tier A-2.
      // Hệ số bổ sung dùng mức người dùng mới (0.7) vì demo không có lịch sử 90 ngày thật.
      const calc = calculatePoints({
        distanceKm: preset.distanceKm,
        baselineVehicle: 'petrolMoto',
        replacementVehicle: preset.replacementVehicle,
        confidenceTier: preset.confidenceTier,
        additionality: ADDITIONALITY.NEW_USER,
      })
      setScanning(false)
      setScanCount((n) => n + 1)
      setResult(calc)
    }, SCAN_MS)
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

  const handleClaim = (event) => {
    playClickSound()
    if (!result || claimed) return
    playRewardSound()
    fx.burst(event.currentTarget, { text: `+${result.points.toFixed(2)}` })
    onClaim(selectedPreset, result)
    setClaimed(true)
  }

  const frameLabel = scanning
    ? 'Scanning…'
    : result
      ? `Scanned: ${selectedPreset.label}`
      : `Tap to scan · ${selectedPreset.label}`

  return (
    <div className="gf-screen">
      <div className="gf-scan-header">
        <button type="button" className="gf-scan-close" aria-label="Close scan" onClick={handleClose}>
          <X size={20} strokeWidth={3} />
        </button>
        <h1 className="gf-scan-header-title">Scan QR Code</h1>
        <p className="gf-scan-header-desc">
          Scan the QR code at the bus stop to start tracking your green journey. The QR code refreshes every 30
          seconds.
        </p>
        <Mascot name="eyes" className="gf-scan-eyes" />
      </div>

      <div className="gf-screen-body gf-scan-body">
        <button
          type="button"
          className={`gf-qr-frame${scanning ? ' gf-qr-scanning' : ''}${result ? ' gf-qr-done' : ''}`}
          aria-label={`Simulate scan: ${selectedPreset.label}`}
          onClick={handleScanFrame}
          disabled={scanning}
        >
          <span className="gf-qr-corner gf-qr-corner-tl" />
          <span className="gf-qr-corner gf-qr-corner-tr" />
          <span className="gf-qr-corner gf-qr-corner-bl" />
          <span className="gf-qr-corner gf-qr-corner-br" />
          <span className="gf-qr-grid" aria-hidden="true" />
          <span className="gf-qr-laser" aria-hidden="true" />
          {result && <span key={scanCount} className="gf-qr-flash" aria-hidden="true" />}
          <span className="gf-qr-frame-hint">
            <QrCode size={56} strokeWidth={1.2} className="gf-qr-icon" />
            <span className="gf-qr-frame-hint-label" aria-live="polite">
              {frameLabel}
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
              disabled={scanning}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <button type="button" className="gf-scan-upload-btn" onClick={handleScanFrame} disabled={scanning}>
          <span>Upload from gallery</span>
          <Upload size={18} />
        </button>

        <Mascot
          key={`mascot-${scanCount}`}
          name="green-kiss"
          className={`gf-scan-mascot${result ? ' gf-scan-mascot-cheer' : ''}`}
        />

        {result && (
          <div key={`result-${scanCount}`} className="gf-scan-result gf-scan-result-in">
            {result.steps.map((step, i) => (
              <div key={step.label} className="gf-scan-step-row" style={{ '--i': i }}>
                <span>{step.label}</span>
                <span>{step.value}</span>
              </div>
            ))}
            <div className="gf-scan-total">
              +{result.points.toFixed(2)} points (≈ {Math.round(result.voucherValueVnd)}đ)
            </div>
            <button
              type="button"
              className={`gf-voucher-btn${claimed ? '' : ' gf-btn-shine'}`}
              disabled={claimed}
              onClick={handleClaim}
            >
              {claimed ? 'Added to your score ✓' : 'Claim points'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
