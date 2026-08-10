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

// Dữ liệu mô phỏng — KHÔNG phải tuyến xe buýt thật, chỉ để minh họa logic gợi ý cá nhân hóa.
const MOCK_AREAS = {
  'Cầu Giấy': [
    { ten: 'Tuyến 09', mo_ta: 'Cầu Giấy - Bờ Hồ', do_phu: 3 },
    { ten: 'Tuyến 34', mo_ta: 'Cầu Giấy - Mỹ Đình', do_phu: 2 },
  ],
  'Đống Đa': [{ ten: 'Tuyến 25', mo_ta: 'Đống Đa - Giáp Bát', do_phu: 3 }],
  'Hai Bà Trưng': [{ ten: 'Tuyến 08', mo_ta: 'Hai Bà Trưng - Long Biên', do_phu: 2 }],
  'Long Biên': [{ ten: 'Tuyến 17', mo_ta: 'Long Biên - Nội Bài', do_phu: 1 }],
  'Hà Đông': [{ ten: 'Tuyến 01 (BRT)', mo_ta: 'Yên Nghĩa - Kim Mã', do_phu: 3 }],
}

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

// Công thức quy đổi chi tiêu xăng → km → PM2.5 → điếu thuốc tương đương, dùng chung cho bước
// phân tích ban đầu và bước xác nhận qua chi tiêu tuần sau.
function calcGasoline(amount) {
  const liters = amount / GASOLINE_PRICE_PER_LITER
  const km = liters * KM_PER_LITER
  const pm25g = km * PM25_G_PER_KM
  const cigarettes = (pm25g * 1000) / MG_PER_CIGARETTE
  return { liters, km, pm25g, cigarettes }
}

export default function FuelPollutionWidget() {
  const [rows, setRows] = useState([{ id: 1, fuelType: 'xang', amount: '', period: 'thang' }])
  const [results, setResults] = useState(null)

  // Bước 3 — gợi ý cá nhân hóa
  const areaKeys = Object.keys(MOCK_AREAS)
  const [destination, setDestination] = useState('')
  const [selectedArea, setSelectedArea] = useState(areaKeys[0])
  const [tripDistance, setTripDistance] = useState('3')
  const [ranking, setRanking] = useState(null)
  const [selectedOptionKey, setSelectedOptionKey] = useState(null)
  const [appliedOption, setAppliedOption] = useState(null)

  // Bước 4 — xác nhận qua dữ liệu chi tiêu tuần sau
  const [nextWeekAmount, setNextWeekAmount] = useState('')
  const [confirmResult, setConfirmResult] = useState(null)

  // Bước 5 — hành động
  const [fundMsg, setFundMsg] = useState('')

  const resetDownstream = () => {
    setRanking(null)
    setSelectedOptionKey(null)
    setAppliedOption(null)
    setNextWeekAmount('')
    setConfirmResult(null)
    setFundMsg('')
  }

  const addRow = () => {
    setRows((r) => [...r, { id: nextId++, fuelType: 'xang', amount: '', period: 'thang' }])
  }

  const removeRow = (id) => {
    setRows((r) => (r.length > 1 ? r.filter((row) => row.id !== id) : r))
  }

  const updateRow = (id, field, value) => {
    setRows((r) => r.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
    setResults(null)
    resetDownstream()
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
      const { liters, km, pm25g, cigarettes } = calcGasoline(amount)

      totalPm25g += pm25g
      totalCigarettes += cigarettes
      totalKm += km

      return { ...row, supported: true, amountNum: amount, liters, km, pm25g, cigarettes }
    })

    setResults({ perRow, totalPm25g, totalCigarettes, totalKm })
    resetDownstream()
  }

  const refuelFrequency = useMemo(() => {
    if (!results) return 0
    return results.perRow.filter((r) => r.supported).length
  }, [results])

  const weightReduce = refuelFrequency >= 4 ? 0.7 : 0.55

  // Tổng chi tiêu xăng xe máy tuần trước, cộng dồn từ các dòng hợp lệ ở bước 1.
  const prevWeekAmount = useMemo(() => {
    if (!results) return 0
    return results.perRow.filter((r) => r.supported).reduce((sum, r) => sum + r.amountNum, 0)
  }, [results])

  const handleRank = () => {
    const candidates = []
    const d = Number(tripDistance)
    if (d > 0 && d <= 5) {
      candidates.push({
        key: 'walk_bike',
        name: 'Đi bộ / xe đạp cho chuyến ngắn',
        pct: 40 - (d / 5) * 30,
        feas: 3 - (d / 5) * 2,
      })
    }
    ;(MOCK_AREAS[selectedArea] ?? []).forEach((route) => {
      candidates.push({
        key: route.ten,
        name: `${route.ten} (${route.mo_ta})`,
        pct: 15 + route.do_phu * 10,
        feas: route.do_phu,
      })
    })
    candidates.push({ key: 'keep_moto', name: 'Giữ nguyên xe máy', pct: 0, feas: 4 })

    const pctVals = candidates.map((c) => c.pct)
    const feasVals = candidates.map((c) => c.feas)
    const pctMin = Math.min(...pctVals)
    const pctMax = Math.max(...pctVals)
    const feasMin = Math.min(...feasVals)
    const feasMax = Math.max(...feasVals)

    const scored = candidates.map((c) => {
      const pctNorm = pctMax === pctMin ? 1 : (c.pct - pctMin) / (pctMax - pctMin)
      const feasNorm = feasMax === feasMin ? 1 : (c.feas - feasMin) / (feasMax - feasMin)
      const score = pctNorm * weightReduce + feasNorm * (1 - weightReduce)
      return { ...c, pctNorm, feasNorm, score }
    })
    scored.sort((a, b) => b.score - a.score)

    setRanking(scored)
    setSelectedOptionKey(scored[0]?.key ?? null)
    setAppliedOption(null)
    setNextWeekAmount('')
    setConfirmResult(null)
  }

  const handleApplyOption = () => {
    const chosen = ranking?.find((c) => c.key === selectedOptionKey)
    if (!chosen) return
    setAppliedOption({ name: chosen.name, targetPct: chosen.pct })
    const suggested = Math.round((prevWeekAmount * (1 - chosen.pct / 100)) / 1000) * 1000
    setNextWeekAmount(String(suggested))
    setConfirmResult(null)
  }

  const handleConfirmSpending = () => {
    if (!appliedOption || prevWeekAmount <= 0) return
    const nextAmt = Math.max(0, Number(nextWeekAmount) || 0)
    const actualReductionPct = ((prevWeekAmount - nextAmt) / prevWeekAmount) * 100
    const achievementRatio = appliedOption.targetPct > 0 ? (actualReductionPct / appliedOption.targetPct) * 100 : 0
    const success = achievementRatio >= 70
    const reducedAmount = Math.max(0, prevWeekAmount - nextAmt)
    const { pm25g, cigarettes } = calcGasoline(reducedAmount)

    setConfirmResult({
      prevWeekAmount,
      nextWeekAmount: nextAmt,
      actualReductionPct,
      achievementRatio,
      success,
      reducedAmount,
      reducedPm25g: pm25g,
      reducedCigarettes: cigarettes,
    })
  }

  return (
    <div className="fpw">
      <h1>Widget giảm bụi mịn PM2.5</h1>
      <p className="subtitle">
        Nhập chi tiêu nhiên liệu để ước tính lượng bụi mịn PM2.5 phát thải — quy đổi ra "số điếu thuốc lá tương đương".
      </p>

      <h2>Bước 1 — Nhập chi tiêu nhiên liệu</h2>
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
          <h2>Bước 2 — Kết quả ước tính từ chi tiêu</h2>

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

          {results.totalKm <= 0 ? (
            <div className="gated-note">
              Chưa có dòng "Xăng xe máy" hợp lệ nào được tính — cần ít nhất một dòng như vậy để minh họa các bước AI tiếp theo.
            </div>
          ) : (
            <>
              {/* Bước 3 — minh họa lớp AI xếp hạng phương án cá nhân hóa */}
              <div className="section">
                <h3>Bước 3 — Gợi ý cá nhân hóa</h3>
                <p className="step-note">
                  Xếp hạng phương án thay thế dựa trên nhiều yếu tố (khu vực, quãng đường mỗi chuyến, tần suất đi lại) — không phải
                  một mức % chọn tùy ý.
                </p>

                <div className="field-row">
                  <label htmlFor="fpw-dest">Điểm đến hàng ngày của bạn (ví dụ: trường học, công ty)</label>
                  <input
                    id="fpw-dest"
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="VD: Công ty ABC, quận Cầu Giấy"
                  />
                </div>
                <div className="field-row">
                  <label htmlFor="fpw-area">Khu vực gần điểm đến</label>
                  <select id="fpw-area" value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
                    {areaKeys.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field-row">
                  <label htmlFor="fpw-trip">Quãng đường trung bình mỗi chuyến (km)</label>
                  <input
                    id="fpw-trip"
                    type="number"
                    min="0"
                    value={tripDistance}
                    onChange={(e) => setTripDistance(e.target.value)}
                  />
                </div>
                <p className="weight-note">
                  Tần suất đổ xăng: <strong>{refuelFrequency} lần/tháng</strong> (tự động suy ra từ số dòng "Xăng xe máy" hợp lệ ở
                  Bước 1) → trọng số ưu tiên giảm mạnh ={' '}
                  <strong>{weightReduce}</strong> ({refuelFrequency >= 4 ? '≥ 4 lần/tháng' : '< 4 lần/tháng'}). Công thức: điểm =
                  (%đổi được chuẩn hóa) × {weightReduce} + (độ khả thi chuẩn hóa) × {fmt(1 - weightReduce, 2)}.
                </p>

                <div className="toolbar">
                  <button className="btn-secondary" onClick={handleRank}>
                    Xếp hạng phương án
                  </button>
                </div>

                {ranking && (
                  <>
                    <p className="step-note">
                      Với quãng đường từ nhà đến{' '}
                      <strong>{destination.trim() ? destination.trim() : '(điểm đến chưa đặt tên)'}</strong>, các phương án phù hợp
                      nhất là:
                    </p>
                    {ranking.length === 1 && (
                      <div className="muted-note">
                        Chưa có phương án thay thế nào phù hợp (quãng đường mỗi chuyến {'>'} 5km hoặc khu vực chưa có tuyến buýt mô
                        phỏng) — chỉ còn "Giữ nguyên xe máy".
                      </div>
                    )}
                    <table>
                      <thead>
                        <tr>
                          <th></th>
                          <th>Phương án</th>
                          <th>% đổi được</th>
                          <th>Độ khả thi</th>
                          <th>Điểm xếp hạng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ranking.map((c) => (
                          <tr key={c.key}>
                            <td>
                              <input
                                type="radio"
                                name="fpw-option"
                                checked={selectedOptionKey === c.key}
                                onChange={() => setSelectedOptionKey(c.key)}
                              />
                            </td>
                            <td>{c.name}</td>
                            <td>{fmt(c.pct, 0)}%</td>
                            <td>{fmt(c.feas, 1)}</td>
                            <td>{fmt(c.score, 3)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="toolbar">
                      <button className="btn-primary" onClick={handleApplyOption}>
                        Áp dụng phương án này
                      </button>
                    </div>

                    {appliedOption && (
                      <div className="official-note">
                        Đã áp dụng: <strong>{appliedOption.name}</strong> — mục tiêu đổi{' '}
                        <strong>{fmt(appliedOption.targetPct, 0)}%</strong> quãng đường (cũng là % mục tiêu giảm chi tiêu xăng).
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Bước 4 — xác nhận qua dữ liệu chi tiêu tuần sau, thay cho log GPS */}
              <div className="section">
                <h3>Bước 4 — Xác nhận qua dữ liệu chi tiêu tuần sau</h3>
                <p className="step-note">
                  Vì PM2.5 trong demo này được tính trực tiếp từ chi tiêu xăng, chi tiêu tuần sau giảm đúng theo mục tiêu tự nó là
                  bằng chứng giảm phát thải — không cần theo dõi vị trí.
                </p>

                {!appliedOption ? (
                  <div className="gated-note">Cần hoàn thành Bước 3 (áp dụng một phương án) trước khi xác nhận.</div>
                ) : appliedOption.targetPct <= 0 ? (
                  <div className="gated-note">
                    Phương án đã chọn ("Giữ nguyên xe máy") không có mục tiêu đổi hành vi nào để xác nhận.
                  </div>
                ) : (
                  <>
                    <div className="diff-line">
                      Phương án đã chọn: <strong>{appliedOption.name}</strong> · Mục tiêu:{' '}
                      <strong>{fmt(appliedOption.targetPct, 0)}%</strong> giảm chi tiêu xăng · Chi tiêu tuần trước:{' '}
                      <strong>{fmt(prevWeekAmount)} đ</strong>
                    </div>

                    <div className="field-row">
                      <label htmlFor="fpw-next-amount">Chi tiêu xăng xe máy tuần sau (VND, mô phỏng)</label>
                      <input
                        id="fpw-next-amount"
                        type="number"
                        min="0"
                        value={nextWeekAmount}
                        onChange={(e) => setNextWeekAmount(e.target.value)}
                      />
                    </div>

                    <div className="toolbar">
                      <button className="btn-secondary" onClick={handleConfirmSpending}>
                        Xác nhận qua dữ liệu chi tiêu
                      </button>
                    </div>

                    {confirmResult && (
                      <>
                        <div className="diff-line">
                          Giảm thực tế: <strong>{fmt(confirmResult.actualReductionPct, 1)}%</strong> chi tiêu xăng so với mục tiêu{' '}
                          <strong>{fmt(appliedOption.targetPct, 0)}%</strong> (đạt {fmt(confirmResult.achievementRatio, 0)}% mục
                          tiêu)
                        </div>

                        {confirmResult.success ? (
                          <div className="success-box">
                            ✓ Đạt ngưỡng xác nhận (≥ 70% mục tiêu). Giảm thực tế:{' '}
                            <strong>{fmt(confirmResult.reducedPm25g, 1)} g PM2.5</strong> ≈{' '}
                            <strong>{fmt(confirmResult.reducedCigarettes, 0)} điếu thuốc tương đương</strong> (từ{' '}
                            {fmt(confirmResult.reducedAmount)} đ chi tiêu giảm được). Đủ điều kiện cộng điểm thưởng.
                          </div>
                        ) : (
                          <div className="fail-box">
                            ✗ Chưa đạt ngưỡng xác nhận (dưới 70% mục tiêu). Chưa cộng điểm thưởng — hệ thống sẽ tiếp tục theo dõi
                            tuần tới.
                          </div>
                        )}

                        <p className="caption">
                          Lưu ý: so sánh 1 tuần với 1 tuần liền kề có thể bị nhiễu bởi lý do không liên quan (đi công tác, nghỉ lễ,
                          mua gộp xăng tuần trước). Bản demo chấp nhận giới hạn này — bản thật nên dùng trung bình vài tuần làm
                          baseline thay vì so từng tuần đơn lẻ.
                        </p>
                      </>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          <div className="section actions">
            <h3>Bước 5 — Hành động</h3>
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
          <li>Danh sách tuyến xe buýt theo khu vực (Bước 3) là dữ liệu mô phỏng để minh họa logic gợi ý, chưa phải dữ liệu vận tải công cộng thật.</li>
          <li>
            Xác nhận đổi hành vi (Bước 4) trong bản demo này dựa trên thay đổi chi tiêu xăng khai báo tay, không phải dữ liệu thật;
            bản sản xuất cần cân nhắc thêm cách xác thực chống gian lận (ví dụ người dùng khai giảm chi tiêu nhưng thực ra đổi sang
            đổ xăng bằng tiền mặt để né hệ thống).
          </li>
        </ul>
      </div>
    </div>
  )
}
