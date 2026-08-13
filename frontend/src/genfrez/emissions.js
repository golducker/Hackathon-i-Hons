// Công thức tính điểm — Business Model Canvas §5.5 và §7.2–§7.4.
// Điểm = Avoided emissions × Conversion rate × Confidence × Additionality × Budget coefficient

// BMC §7.4 — hệ số phát thải theo phương tiện (g CO2/km)
export const VEHICLE_FACTORS = {
  petrolMoto: { label: 'Xe máy xăng (đường cơ sở)', gPerKm: 95 },
  electricMoto: { label: 'Xe máy điện', gPerKm: 30 },
  busMarginal: { label: 'Xe buýt (hành khách tăng thêm)', gPerKm: 0 },
  electricCar1p: { label: 'Ô tô điện, 1 người', gPerKm: 93 },
  walking: { label: 'Đi bộ / xe đạp cá nhân', gPerKm: 0 },
}

// BMC §7.3 — hệ số tin cậy theo tầng xác minh
export const CONFIDENCE_TIERS = {
  A1: { label: 'A-1 · Webhook đối tác', value: 1.0 },
  A2: { label: 'A-2 · Vé điện tử Hà Nội', value: 1.0 },
  B: { label: 'B · GPS + QR động', value: 0.7 },
  C: { label: 'C · Tự khai báo có ảnh', value: 0.2 },
}

// BMC §7.2 — hệ số bổ sung: người dùng mới (30 ngày đầu) mặc định 0.7, sàn 0.4, trần 1.0
export const ADDITIONALITY = { NEW_USER: 0.7, FLOOR: 0.4, CEILING: 1.0, HABITUAL: 0.9 }

// BMC §5.5 — hệ số ngân sách giai đoạn thí điểm
export const BUDGET_COEFFICIENT_PILOT = 0.3

// BMC §5.5 — quy đổi cố định: 25g CO2 tránh được = 1 điểm; 1 điểm = 100đ mệnh giá voucher
export const GRAMS_PER_POINT = 25
export const VND_PER_POINT = 100

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
      { label: 'Quãng đường', value: `${distanceKm} km` },
      {
        label: 'Chênh lệch hệ số phát thải',
        value: `${baselineFactor} − ${replacementFactor} = ${factorDiff} g CO2/km`,
      },
      { label: 'CO2 tránh được (chưa chiết khấu)', value: `${rawAvoidedG.toFixed(2)} g` },
      { label: 'Hệ số tin cậy', value: confidenceValue.toFixed(2) },
      { label: 'Hệ số bổ sung', value: additionality.toFixed(2) },
      { label: 'Hệ số ngân sách', value: budgetCoefficient.toFixed(2) },
      { label: 'CO2 tránh được (sau chiết khấu)', value: `${co2AvoidedG.toFixed(2)} g` },
      { label: 'Quy đổi điểm (÷ 25g/điểm)', value: `${points.toFixed(2)} điểm` },
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
