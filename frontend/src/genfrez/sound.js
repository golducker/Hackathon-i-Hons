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

// Chuỗi hợp âm trưởng đi lên (C5-E5-G5-C6) mô phỏng tiếng "thăng hạng" kiểu game —
// dùng triangle wave (âm sắc sáng hơn sine) để khác hẳn tiếng click thường.
export function playLevelUpSound() {
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  const notes = [523.25, 659.25, 783.99, 1046.5]

  notes.forEach((freq, i) => {
    const start = now + i * 0.09
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()

    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(freq, start)

    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(0.22, start + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35)

    oscillator.connect(gain)
    gain.connect(ctx.destination)

    oscillator.start(start)
    oscillator.stop(start + 0.4)
  })
}
