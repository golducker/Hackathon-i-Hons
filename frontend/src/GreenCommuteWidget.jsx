import { useState } from 'react'
import './GreenCommuteWidget.css'

const API_URL = import.meta.env.VITE_API_URL

const PRESETS = [
  { label: 'Xe buýt 08 — 7.000đ', merchant: 'Xe buýt tuyến 08', amount: 7000 },
  { label: 'Metro Bến Thành - Suối Tiên — 20.000đ', merchant: 'Metro Bến Thành - Suối Tiên', amount: 20000 },
  { label: 'Xe đạp công cộng TNGo — 10.000đ', merchant: 'TNGo xe đạp công cộng', amount: 10000 },
  { label: 'Highlands Coffee — 45.000đ (ví dụ không liên quan di chuyển)', merchant: 'Highlands Coffee', amount: 45000 },
]

// Danh mục đổi thưởng minh họa cho demo — mốc điểm chọn để đạt được sau vài giao dịch
// (mỗi giao dịch hợp lệ ~70 điểm), không phải số liệu tài chính thật.
const REWARDS = [
  { id: 'discount5k', label: 'Giảm 5.000đ vé xe buýt/metro lượt sau', type: 'Giảm giá', cost: 50 },
  { id: 'cashback15k', label: 'Hoàn 15.000đ vào ví điện tử', type: 'Hoàn tiền', cost: 150 },
  { id: 'voucher_drink', label: 'Voucher nước uống 25.000đ (đối tác)', type: 'Voucher', cost: 300 },
  { id: 'discount_month', label: 'Giảm 20% vé tháng xe buýt', type: 'Giảm giá', cost: 500 },
]

function fmt(n, digits = 0) {
  return n.toLocaleString('vi-VN', { maximumFractionDigits: digits, minimumFractionDigits: digits })
}

export default function GreenCommuteWidget() {
  const [merchant, setMerchant] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  // Số dư điểm thưởng — cộng dồn phía client cho demo (backend vẫn stateless, xử lý từng
  // giao dịch độc lập). Số dư này chỉ tồn tại trong phiên trình duyệt hiện tại, mất khi tải lại trang.
  const [balance, setBalance] = useState(0)
  const [redeemMsg, setRedeemMsg] = useState('')

  const applyPreset = (preset) => {
    setMerchant(preset.merchant)
    setAmount(String(preset.amount))
    setResult(null)
    setError('')
  }

  const handleSubmit = async () => {
    if (!merchant.trim() || !amount || Number(amount) <= 0) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`${API_URL}/api/green-commute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchant: merchant.trim(), amount_vnd: Number(amount) }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.detail || `Server trả về lỗi: ${res.status}`)
      }
      const data = await res.json()
      setResult(data)
      if (data.points > 0) {
        setBalance((b) => b + data.points)
      }
    } catch (err) {
      setError(`Không ghi nhận được giao dịch: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleRedeem = (reward) => {
    if (balance < reward.cost) return
    setBalance((b) => b - reward.cost)
    setRedeemMsg(`Đã đổi thành công: "${reward.label}" (-${fmt(reward.cost)} điểm). Mô phỏng, không xử lý giao dịch thật.`)
  }

  return (
    <div className="gcw">
      <h1>Green Commute Reward</h1>
      <p className="subtitle">
        Nhập một giao dịch (mô phỏng) để xem hệ thống ghi nhận điểm thưởng khi bạn trả tiền vé xe buýt/metro/xe đạp công
        cộng thay vì tự lái xe máy.
      </p>

      <div className="balance-card">
        <div className="balance-label">Số dư điểm thưởng</div>
        <div className="balance-value">{fmt(balance)} điểm</div>
      </div>

      <h2>Nhập giao dịch</h2>
      <div className="preset-row">
        {PRESETS.map((p) => (
          <button key={p.label} className="btn-preset" onClick={() => applyPreset(p)}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="field-row">
        <label htmlFor="gcw-merchant">Tên merchant</label>
        <input
          id="gcw-merchant"
          type="text"
          value={merchant}
          onChange={(e) => setMerchant(e.target.value)}
          placeholder="VD: Xe buýt tuyến 08"
        />
      </div>
      <div className="field-row">
        <label htmlFor="gcw-amount">Số tiền (VND)</label>
        <input
          id="gcw-amount"
          type="number"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
        />
      </div>

      <div className="toolbar">
        <button className="btn-primary" onClick={handleSubmit} disabled={loading || !merchant.trim() || !amount}>
          {loading ? 'Đang phân tích với Gemini...' : 'Ghi nhận giao dịch'}
        </button>
      </div>

      {error && <div className="fail-box">{error}</div>}

      {result && (
        <div className="results-card">
          <h2>Kết quả</h2>

          <div className="ai-box">
            <div className="ai-label">Suy luận của Gemini (Lớp 2)</div>
            <div className="ai-line">
              Phương thức: <strong>{result.ai.transport_mode}</strong> · Quãng đường trung bình hành khách tuyến này:{' '}
              <strong>{fmt(result.ai.avg_route_distance_km, 1)} km</strong>
            </div>
            <div className="ai-explanation">{result.ai.explanation}</div>
            <div className="ai-caveat">
              Không thể biết bạn lên/xuống ở điểm nào từ dòng giao dịch này, nên đây là mức trung bình điển hình của
              hành khách trên tuyến/loại hình này, không phải quãng đường thực tế của riêng chuyến đi này.
            </div>
          </div>

          {result.ai.is_plausible_moto_replacement ? (
            <>
              <div className="success-box">
                ✓ Được công nhận là thay thế 1 chuyến xe máy. Cộng <strong>{fmt(result.points)} điểm thưởng</strong>.
              </div>

              <div className="totals">
                Tránh phát thải (Lớp 1, công thức cố định theo hệ số đo thực địa Hà Nội):{' '}
                <strong>{fmt(result.pm25_avoided_g, 2)} g PM2.5</strong> và{' '}
                <strong>{fmt(result.co2_avoided_g, 2)} g CO2</strong> mỗi lần khởi động xe máy tránh được.
                {result.is_short_trip && (
                  <span> Thuộc nhóm chuyến đi ngắn điển hình (&lt; 4,83 km) — nơi tập trung phần lớn phát thải xe máy tại Việt Nam.</span>
                )}
              </div>

              <div className="interpret-box">
                <div className="interpret-line">
                  🌍 Lượng PM2.5 tránh phát thải đủ để làm ô nhiễm tới đúng ngưỡng khuyến nghị phơi nhiễm 24 giờ của WHO
                  (15 µg/m³) một thể tích không khí khoảng <strong>{fmt(result.who_air_volume_m3)} m³</strong>.
                </div>
                <div className="interpret-line">
                  🌳 Lượng CO2 tránh phát thải tương đương lượng một cây xanh trưởng thành hấp thụ trong khoảng{' '}
                  <strong>{fmt(result.tree_hours_equivalent, 1)} giờ</strong>.
                </div>
              </div>
            </>
          ) : (
            <div className="fail-box">
              ✗ Giao dịch không được công nhận là thay thế xe máy — không cộng điểm thưởng.
            </div>
          )}
        </div>
      )}

      <div className="section">
        <h2>Đổi điểm thưởng</h2>
        <p className="step-note">Dùng điểm tích lũy để đổi voucher, hoàn tiền hoặc giảm giá vé đi lại (mô phỏng).</p>

        <div className="reward-grid">
          {REWARDS.map((r) => {
            const affordable = balance >= r.cost
            return (
              <div key={r.id} className={`reward-card${affordable ? '' : ' reward-card-disabled'}`}>
                <div className="reward-type">{r.type}</div>
                <div className="reward-label">{r.label}</div>
                <div className="reward-cost">{fmt(r.cost)} điểm</div>
                <button className="btn-secondary" onClick={() => handleRedeem(r)} disabled={!affordable}>
                  Đổi ngay
                </button>
              </div>
            )
          })}
        </div>

        {redeemMsg && <div className="success-box">{redeemMsg}</div>}
      </div>

      <div className="assumptions">
        <strong>Ghi chú giả định:</strong>
        <ul>
          <li>
            Hệ số phát thải xe máy Hà Nội: 0,12 g PM2.5 và 6,96 g CO2 <em>mỗi lần khởi động xe</em> — công thức Lớp 1 tính
            theo mỗi chuyến, không nhân theo quãng đường.
          </li>
          <li>
            Quãng đường ở Lớp 2 là mức trung bình điển hình của tuyến/loại hình di chuyển (do Gemini suy luận), không
            phải quãng đường thực tế của riêng giao dịch — vì không biết điểm lên/xuống và phần lớn vé xe buýt VN đồng
            giá, không tính theo km.
          </li>
          <li>Điểm thưởng (10 điểm/gam CO2 tránh phát thải) và bảng đổi thưởng là quy đổi minh họa cho demo, không phải số liệu tài chính/khoa học thật.</li>
          <li>
            Quy đổi "thể tích không khí theo ngưỡng WHO" và "giờ hấp thụ của cây xanh" chỉ mang tính minh họa trực quan,
            không phải mô hình phát tán khí thải hay đo đạc thực tế.
          </li>
          <li>
            Đây là bản demo stateless ở backend — mỗi giao dịch nhập tay/mock được xử lý độc lập; số dư điểm chỉ được
            cộng dồn tạm thời phía trình duyệt (mất khi tải lại trang), chưa lưu server/DB.
          </li>
        </ul>
      </div>
    </div>
  )
}
