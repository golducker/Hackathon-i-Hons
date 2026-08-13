// Công thức tính điểm — Business Model Canvas §5.5 và §7.2–§7.4.
// Điểm = Avoided emissions × Conversion rate × Confidence × Additionality × Budget coefficient

// BMC §7.4 — hệ số phát thải theo phương tiện (g CO2/km)
export const VEHICLE_FACTORS = {
  petrolMoto: { label: 'Petrol motorbike (baseline)', gPerKm: 95 },
  electricMoto: { label: 'Electric motorbike', gPerKm: 30 },
  busMarginal: { label: 'Bus (marginal passenger)', gPerKm: 0 },
  electricCar1p: { label: 'Electric car, 1 passenger', gPerKm: 93 },
  walking: { label: 'Walking / personal bicycle', gPerKm: 0 },
}

// BMC §7.3 — hệ số tin cậy theo tầng xác minh
export const CONFIDENCE_TIERS = {
  A1: { label: 'A-1 · Partner webhook', value: 1.0 },
  A2: { label: 'A-2 · Hanoi e-ticketing', value: 1.0 },
  B: { label: 'B · GPS + dynamic QR', value: 0.7 },
  C: { label: 'C · Self-report with photo', value: 0.2 },
}

// BMC §7.2 — hệ số bổ sung: người dùng mới (30 ngày đầu) mặc định 0.7, sàn 0.4, trần 1.0
export const ADDITIONALITY = { NEW_USER: 0.7, FLOOR: 0.4, CEILING: 1.0, HABITUAL: 0.9 }

// BMC §5.5 — hệ số ngân sách giai đoạn thí điểm
export const BUDGET_COEFFICIENT_PILOT = 0.3

// BMC §5.5 — quy đổi cố định: 25g CO2 tránh được = 1 điểm; 1 điểm = 100đ mệnh giá voucher
export const GRAMS_PER_POINT = 25
export const VND_PER_POINT = 100

// Ẩn dụ "cây xanh trung hoà CO2" cho màn hoàn thành nhiệm vụ — ước tính phổ biến hay
// được trích dẫn (gần khớp US EPA, ~21kg CO2/cây/năm), đánh dấu rõ là giả định tham
// khảo cho demo, không phải số đo thực địa như hệ số ở §7.4.
export const TREE_ABSORPTION_KG_PER_YEAR = 21
export const TREE_ABSORPTION_G_PER_HOUR = (TREE_ABSORPTION_KG_PER_YEAR * 1000) / (365 * 24)

export function co2GramsToTreeHours(co2G) {
  return co2G / TREE_ABSORPTION_G_PER_HOUR
}

/**
 * Tính điểm thưởng cho một chuyến đi, trả về cả các bước trung gian để hiển thị
 * cho người dùng/giám khảo thấy cách tính, không chỉ con số cuối.
 */
export function calculatePoints({
  distanceKm,
  baselineVehicle = 'petrolMoto',
  replacementVehicle,
  confidenceTier = 'B',
  additionality = ADDITIONALITY.NEW_USER,
  budgetCoefficient = BUDGET_COEFFICIENT_PILOT,
}) {
  const baselineFactor = VEHICLE_FACTORS[baselineVehicle].gPerKm
  const replacementFactor = VEHICLE_FACTORS[replacementVehicle].gPerKm
  const confidenceValue =
    typeof confidenceTier === 'number' ? confidenceTier : CONFIDENCE_TIERS[confidenceTier].value

  const factorDiff = baselineFactor - replacementFactor
  const rawAvoidedG = distanceKm * factorDiff
  const co2AvoidedG = rawAvoidedG * confidenceValue * additionality * budgetCoefficient
  const points = co2AvoidedG / GRAMS_PER_POINT
  const voucherValueVnd = points * VND_PER_POINT

  return {
    steps: [
      { label: 'Distance', value: `${distanceKm} km` },
      {
        label: 'Emission factor difference',
        value: `${baselineFactor} − ${replacementFactor} = ${factorDiff} g CO2/km`,
      },
      { label: 'CO2 avoided (before discount)', value: `${rawAvoidedG.toFixed(2)} g` },
      { label: 'Confidence coefficient', value: confidenceValue.toFixed(2) },
      { label: 'Additionality coefficient', value: additionality.toFixed(2) },
      { label: 'Budget coefficient', value: budgetCoefficient.toFixed(2) },
      { label: 'CO2 avoided (after discount)', value: `${co2AvoidedG.toFixed(2)} g` },
      { label: 'Converted to points (÷ 25g/point)', value: `${points.toFixed(2)} points` },
    ],
    baselineFactor,
    replacementFactor,
    co2AvoidedG,
    points,
    voucherValueVnd,
  }
}

// Ca kiểm thử từ chính ví dụ đã tính sẵn trong BMC §5.5:
// "5km bus trip, confidence 1.0, additionality 0.9, budget 0.3 → 128g → 5.13 điểm → 513đ"
const check = calculatePoints({
  distanceKm: 5,
  baselineVehicle: 'petrolMoto',
  replacementVehicle: 'busMarginal',
  confidenceTier: 1.0,
  additionality: 0.9,
  budgetCoefficient: 0.3,
})
console.assert(
  Math.abs(check.points - 5.13) < 0.01,
  `[emissions.js] Ca kiểm thử BMC §5.5 lệch: kỳ vọng 5.13 điểm, tính ra ${check.points.toFixed(2)}`
)
console.assert(
  Math.abs(check.voucherValueVnd - 513) < 1,
  `[emissions.js] Ca kiểm thử BMC §5.5 lệch: kỳ vọng 513đ, tính ra ${check.voucherValueVnd.toFixed(0)}đ`
)
