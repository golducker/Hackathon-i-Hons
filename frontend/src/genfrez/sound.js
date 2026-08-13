// Tiếng "click" ngắn tổng hợp bằng Web Audio API — không cần file âm thanh riêng
// (không tăng dung lượng bundle, không phải quản lý asset), chạy được offline.
// AudioContext chỉ tạo một lần và chỉ được phép chạy sau khi có tương tác người
// dùng đầu tiên (chính sách autoplay của trình duyệt) — vì hàm này luôn được gọi
// từ trong onClick nên điều kiện đó tự động thoả mãn.
let audioCtx = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) return null
  if (!audioCtx) audioCtx = new AudioContextClass()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

export function playClickSound() {
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(720, now)
  oscillator.frequency.exponentialRampToValueAtTime(420, now + 0.08)

  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.16, now + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09)

  oscillator.connect(gain)
  gain.connect(ctx.destination)

  oscillator.start(now)
  oscillator.stop(now + 0.1)
}
