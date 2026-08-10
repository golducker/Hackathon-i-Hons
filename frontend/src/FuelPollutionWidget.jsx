import { useMemo, useState } from 'react'
import './FuelPollutionWidget.css'

// Giá xăng E5 RON92, cập nhật ngày 6/8/2026 — giá theo ngày, sẽ thay đổi.
const GASOLINE_PRICE_PER_LITER = 21720
// Mức tiêu thụ ước lượng trung bình đô thị Hà Nội.
const KM_PER_LITER = 40
// Hệ số phát thải PM2.5 đo thực địa tại Hà Nội (nghiên cứu cụ thể, chưa đo trực tiếp trên xe người dùng).
const PM25_G_PER_KM = 0.053
const MG_PER_CIGARETTE = 15

const FUEL_TYPES = [
  { value: 'xang', label: 'Xăng xe máy', supported: true },
  { value: 'gas', label: 'Gas (LPG)', supported: false },
  { value: 'than', label: 'Than tổ ong', supported: false },
  { value: 'dien', label: 'Điện', supported: false },
]

const PERIODS = [
  { value: 'tuan', label: 'Tuần' },
  { value: 'thang', label: 'Tháng' },
]

let nextId = 2

function fmt(n, digits = 0) {
  return n.toLocaleString('vi-VN', { maximumFractionDigits: digits, minimumFractionDigits: digits })
}

function fuelLabel(value) {
  return FUEL_TYPES.find((f) => f.value === value)?.label ?? value
}

function periodLabel(value) {
  return PERIODS.find((p) => p.value === value)?.label ?? value
}

export default function FuelPollutionWidget() {
  const [rows, setRows] = useState([{ id: 1, fuelType: 'xang', amount: '', period: 'thang' }])
  const [results, setResults] = useState(null)
  const [behaviorPct, setBehaviorPct] = useState(20)
  const [commitMsg, setCommitMsg] = useState('')
  const [fundMsg, setFundMsg] = useState('')

  const addRow = () => {
    setRows((r) => [...r, { id: nextId++, fuelType: 'xang', amount: '', period: 'thang' }])
  }

  const removeRow = (id) => {
    setRows((r) => (r.length > 1 ? r.filter((row) => row.id !== id) : r))
  }

  const updateRow = (id, field, value) => {
    setRows((r) => r.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
    setResults(null)
    setCommitMsg('')
    setFundMsg('')
  }

  const handleAnalyze = () => {
    let totalPm25g = 0
    let totalCigarettes = 0
    let totalKm = 0

    const perRow = rows.map((row) => {
      const amount = Number(row.amount)
      if (row.fuelType !== 'xang' || !amount || amount <= 0) {
        return { ...row, supported: false }
      }
      const liters = amount / GASOLINE_PRICE_PER_LITER
      const km = liters * KM_PER_LITER
      const pm25g = km * PM25_G_PER_KM
      const cigarettes = (pm25g * 1000) / MG_PER_CIGARETTE

      totalPm25g += pm25g
      totalCigarettes += cigarettes
      totalKm += km

      return { ...row, supported: true, liters, km, pm25g, cigarettes }
    })

    setResults({ perRow, totalPm25g, totalCigarettes, totalKm })
    setCommitMsg('')
    setFundMsg('')
  }

  const behaviorReduction = useMemo(() => {
    if (!results || results.totalKm <= 0) return null
    const reducedKm = (results.totalKm * behaviorPct) / 100
    const reducedPm25g = reducedKm * PM25_G_PER_KM
    const reducedCigarettes = (reducedPm25g * 1000) / MG_PER_CIGARETTE
    return { reducedKm, reducedPm25g, reducedCigarettes }
  }, [results, behaviorPct])

  return (
    <div className="fpw">
      <h1>Widget giảm bụi mịn PM2.5</h1>
      <p className="subtitle">
        Nhập chi tiêu nhiên liệu để ước tính lượng bụi mịn PM2.5 phát thải — quy đổi ra "số điếu thuốc lá tương đương".
      </p>

      <table>
        <thead>
          <tr>
            <th>Loại nhiên liệu</th>
            <th>Số tiền (VND)</th>
            <th>Kỳ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <select value={row.fuelType} onChange={(e) => updateRow(row.id, 'fuelType', e.target.value)}>
                  {FUEL_TYPES.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={row.amount}
                  onChange={(e) => updateRow(row.id, 'amount', e.target.value)}
                  placeholder="0"
                />
              </td>
              <td>
                <select value={row.period} onChange={(e) => updateRow(row.id, 'period', e.target.value)}>
                  {PERIODS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button className="remove-btn" onClick={() => removeRow(row.id)} disabled={rows.length === 1} title="Xóa dòng">
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="toolbar">
        <button className="btn-secondary" onClick={addRow}>
          + Thêm dòng
        </button>
        <button className="btn-primary" onClick={handleAnalyze}>
          Phân tích
        </button>
      </div>

      {results && (
        <div className="results-card">
          <h2>Kết quả</h2>

          <ul className="row-list">
            {results.perRow.map((row) => (
              <li key={row.id}>
                <div className="row-head">
                  {fuelLabel(row.fuelType)} — {row.amount ? `${fmt(Number(row.amount))} đ` : '(chưa nhập)'} / {periodLabel(row.period)}
                </div>
                {row.supported ? (
                  <div className="row-detail">
                    ≈ {fmt(row.km, 0)} km → {fmt(row.pm25g, 1)} g PM2.5 → <strong>{fmt(row.cigarettes, 0)} điếu thuốc tương đương</strong>
                  </div>
                ) : (
                  <div className="row-warn">⚠ Hệ số phát thải PM2.5 đang được kiểm chứng, chưa đưa vào bản tính demo.</div>
                )}
              </li>
            ))}
          </ul>

          <div className="totals">
            Tổng: <strong>{fmt(results.totalPm25g, 1)} g PM2.5</strong> ≈ <strong>{fmt(results.totalCigarettes, 0)} điếu thuốc lá tương đương</strong>
          </div>

          <div className="section">
            <h3>Gợi ý đổi hành vi</h3>
            <div className="behavior-row">
              <span>Đổi</span>
              <input
                type="number"
                min="0"
                max="100"
                value={behaviorPct}
                onChange={(e) => setBehaviorPct(Number(e.target.value))}
              />
              <span>% quãng đường sang xe buýt / đi bộ / xe đạp</span>
            </div>
            {behaviorReduction && (
              <div className="behavior-result">
                → Giảm được <strong>{fmt(behaviorReduction.reducedPm25g, 1)} g PM2.5</strong> ≈{' '}
                <strong>{fmt(behaviorReduction.reducedCigarettes, 0)} điếu thuốc tương đương</strong>
              </div>
            )}
          </div>

          <div className="section actions">
            <div>
              <button
                className="btn-commit"
                onClick={() =>
                  setCommitMsg(
                    'Đã ghi nhận cam kết! (Mô phỏng — ở bản sản phẩm thật, hệ thống sẽ đối chiếu dữ liệu GPS tuần sau trước khi ghi điểm thưởng.)'
                  )
                }
              >
                Cam kết đổi hành vi
              </button>
              {commitMsg && <div className="action-msg">{commitMsg}</div>}
            </div>
            <div>
              <button
                className="btn-fund"
                onClick={() => setFundMsg('Đã mô phỏng góp quỹ 20.000đ vào quỹ đổi xe điện. (Không xử lý thanh toán thật.)')}
              >
                Góp quỹ đổi xe điện (20.000đ)
              </button>
              {fundMsg && <div className="action-msg">{fundMsg}</div>}
            </div>
          </div>
        </div>
      )}

      <div className="assumptions">
        <strong>Ghi chú giả định:</strong>
        <ul>
          <li>Giá xăng E5 RON92 = {fmt(GASOLINE_PRICE_PER_LITER)} đ/lít, cập nhật ngày 6/8/2026 — giá thay đổi theo ngày.</li>
          <li>Mức tiêu thụ {KM_PER_LITER} km/lít là ước lượng trung bình đô thị Hà Nội, không phải số đo trên xe cụ thể.</li>
          <li>Hệ số phát thải {PM25_G_PER_KM} g PM2.5/km lấy từ một nghiên cứu đo thực địa tại Hà Nội, chưa đo trực tiếp trên xe của người dùng.</li>
        </ul>
      </div>
    </div>
  )
}
