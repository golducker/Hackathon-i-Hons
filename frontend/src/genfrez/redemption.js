// Mô phỏng deep link + verification token của BMC §7.6 — chỉ là chuỗi minh hoạ,
// không có backend thật đứng sau, không xử lý thanh toán. Dùng chung giữa
// GenFreZApp (nơi state redeemedVouchers sống) và các màn hiển thị voucher.
export function generateRedemption(voucher) {
  const token = Math.random().toString(36).slice(2, 10).toUpperCase()
  return {
    code: `GFZ-${voucher.id.slice(0, 4).toUpperCase()}-${token}`,
    deepLink: `genfrez://redeem?voucher=${voucher.id}&token=${token}`,
    redeemedAt: Date.now(),
    usedAt: null,
  }
}
