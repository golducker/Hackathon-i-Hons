import { useMemo, useState } from 'react'
import './FuelPollutionWidget.css'

const API_URL = import.meta.env.VITE_API_URL

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

  // Bước 3 — gợi ý cá nhân hóa (Gemini ước tính khoảng cách + phương án từ 2 địa chỉ)
  const [homeAddress, setHomeAddress] = useState('')
  const [destinationAddress, setDestinationAddress] = useState('')
  const [routeLoading, setRouteLoading] = useState(false)
  const [routeError, setRouteError] = useState('')
  const [routeSuggestion, setRouteSuggestion] = useState(null)
  const [ranking, setRanking] = useState(null)
  const [selectedOptionKey, setSelectedOptionKey] = useState(null)
  const [appliedOption, setAppliedOption] = useState(null)

  // Bước 4 — xác nhận qua dữ liệu chi tiêu tuần sau
  const [nextWeekAmount, setNextWeekAmount] = useState('')
  const [confirmResult, setConfirmResult] = useState(null)

  // Bước 5 — hành động
  const [fundMsg, setFundMsg] = useState('')

  const resetDownstream = () => {
    setRouteSuggestion(null)
    setRouteError('')
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

  // Xếp hạng phương án từ danh sách candidate (do Gemini gợi ý + "Giữ nguyên xe máy" baseline).
  // Công thức điểm giữ nguyên không đổi: điểm = %đổi được chuẩn hóa × trọng số + độ khả thi chuẩn hóa × (1 - trọng số).
  const rankCandidates = (candidates) => {
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
    return scored
  }

  const handleFindRoutes = async () => {
    if (!homeAddress.trim() || !destinationAddress.trim()) return
    setRouteLoading(true)
    setRouteError('')
    setRouteSuggestion(null)
    setRanking(null)
    setAppliedOption(null)
    setNextWeekAmount('')
    setConfirmResult(null)

    try {
      const res = await fetch(`${API_URL}/api/route-suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ home_address: homeAddress, destination_address: destinationAddress }),
      })
      if (!res.ok) {
        throw new Error(`Server trả về lỗi: ${res.status}`)
      }
      const data = await res.json()
      setRouteSuggestion(data)

      const candidates = data.options.map((opt) => ({
        key: opt.name,
        name: opt.name,
        description: opt.description,
        pct: opt.pct,
        feas: opt.feas,
      }))
      candidates.push({ key: 'keep_moto', name: 'Giữ nguyên xe máy', description: '', pct: 0, feas: 4 })

      const scored = rankCandidates(candidates)
      setRanking(scored)
      setSelectedOptionKey(scored[0]?.key ?? null)
    } catch (err) {
      setRouteError(`Không lấy được gợi ý từ Gemini: ${err.message}`)
    } finally {
      setRouteLoading(false)
    }
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
              {/* Bước 3 — minh họa lớp AI xếp hạng phương án cá nhân hóa, dữ liệu do Gemini ước tính */}
              <div className="section">
                <h3>Bước 3 — Gợi ý cá nhân hóa</h3>
                <p className="step-note">
                  Nhập địa chỉ nhà và điểm đến hàng ngày — Gemini ước tính quãng đường và gợi ý phương án di chuyển xanh hơn, sau đó
                  hệ thống xếp hạng theo nhiều yếu tố (không phải một mức % chọn tùy ý).
                </p>
                <p className="caption">
                  Đây là ước tính của Gemini dựa trên kiến thức đã huấn luyện, chưa tra cứu Google Maps trực tiếp — khoảng cách và
                  tên tuyến có thể không chính xác 100%, chỉ dùng để minh họa logic gợi ý cá nhân hóa.
                </p>

                <div className="field-row">
                  <label htmlFor="fpw-home">Địa chỉ nhà</label>
                  <input
                    id="fpw-home"
                    type="text"
                    value={homeAddress}
                    onChange={(e) => setHomeAddress(e.target.value)}
                    placeholder="VD: Ngõ 121 Chùa Láng, Đống Đa, Hà Nội"
                  />
                </div>
                <div className="field-row">
                  <label htmlFor="fpw-dest">Điểm đến hàng ngày (trường học/công ty)</label>
                  <input
                    id="fpw-dest"
                    type="text"
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    placeholder="VD: Đại học Bách Khoa Hà Nội"
                  />
                </div>
                <p className="weight-note">
                  Tần suất đổ xăng: <strong>{refuelFrequency} lần/tháng</strong> (tự động suy ra từ số dòng "Xăng xe máy" hợp lệ ở
                  Bước 1) → trọng số ưu tiên giảm mạnh ={' '}
                  <strong>{weightReduce}</strong> ({refuelFrequency >= 4 ? '≥ 4 lần/tháng' : '< 4 lần/tháng'}). Công thức: điểm =
                  (%đổi được chuẩn hóa) × {weightReduce} + (độ khả thi chuẩn hóa) × {fmt(1 - weightReduce, 2)}.
                </p>

                <div className="toolbar">
                  <button
                    className="btn-secondary"
                    onClick={handleFindRoutes}
                    disabled={routeLoading || !homeAddress.trim() || !destinationAddress.trim()}
                  >
                    {routeLoading ? 'Đang hỏi Gemini...' : 'Tìm phương án di chuyển xanh'}
                  </button>
                </div>

                {routeError && <div className="fail-box">{routeError}</div>}

                {ranking && routeSuggestion && (
                  <>
                    <p className="step-note">
                      Với quãng đường ước tính <strong>{fmt(routeSuggestion.distance_km, 1)} km</strong> từ{' '}
                      <strong>{homeAddress.trim()}</strong> đến <strong>{destinationAddress.trim()}</strong>, các phương án phù hợp
                      nhất là:
                    </p>
                    {ranking.length === 1 && (
                      <div className="muted-note">
                        Gemini không đề xuất phương án thay thế nào phù hợp cho quãng đường này — chỉ còn "Giữ nguyên xe máy".
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
                            <td>
                              {c.name}
                              {c.description && <div className="option-desc">{c.description}</div>}
                            </td>
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
          <li>
            Khoảng cách và phương án di chuyển ở Bước 3 do Gemini ước tính từ kiến thức đã huấn luyện, KHÔNG tra cứu Google Maps
            trực tiếp (tool grounding Maps của Gemini chỉ chạy qua Vertex AI, không hỗ trợ trên Gemini Developer API đang dùng) —
            tên tuyến/khoảng cách có thể sai lệch so với thực tế.
          </li>
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
