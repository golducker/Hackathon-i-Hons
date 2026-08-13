// Linh vật vẽ thẳng bằng SVG inline, phỏng theo ảnh sprite sheet thật (4 nhân vật
// người dùng gửi trong chat) — không có file ảnh gốc trên máy để dùng trực tiếp
// (đã tìm khắp frontend/public, Downloads, Desktop, temp — không thấy), nên đây là
// bản vẽ tay bám sát dáng/màu/biểu cảm của ảnh gốc thay vì suy đoán như lần đầu.
// Khi nào có file thật, chỉ cần đổi 4 component này sang <img src="/mascots.png" .../>
// với background-position cắt từng ô, không cần đụng tới nơi gọi (HomeScreen/VouchersScreen).

export function PinkBlobMascot({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* tóc/thân xù dạng cụm tròn bao quanh đầu */}
      <circle cx="18" cy="55" r="10" fill="var(--gf-pink)" />
      <circle cx="16" cy="38" r="9" fill="var(--gf-pink)" />
      <circle cx="23" cy="23" r="9.5" fill="var(--gf-pink)" />
      <circle cx="35" cy="12" r="10" fill="var(--gf-pink)" />
      <circle cx="50" cy="8" r="10.5" fill="var(--gf-pink)" />
      <circle cx="65" cy="12" r="10" fill="var(--gf-pink)" />
      <circle cx="77" cy="23" r="9.5" fill="var(--gf-pink)" />
      <circle cx="84" cy="38" r="9" fill="var(--gf-pink)" />
      <circle cx="82" cy="55" r="10" fill="var(--gf-pink)" />
      {/* đầu chính */}
      <circle cx="50" cy="48" r="34" fill="var(--gf-pink)" />
      {/* má */}
      <ellipse cx="27" cy="52" rx="5.5" ry="4.5" fill="var(--gf-magenta)" opacity="0.55" />
      <ellipse cx="73" cy="52" rx="5.5" ry="4.5" fill="var(--gf-magenta)" opacity="0.55" />
      {/* mắt */}
      <ellipse cx="39" cy="44" rx="4.2" ry="5.5" fill="var(--gf-ink)" />
      <ellipse cx="61" cy="44" rx="4.2" ry="5.5" fill="var(--gf-ink)" />
      {/* miệng há hốc + lưỡi */}
      <rect x="36" y="55" width="28" height="18" rx="9" fill="var(--gf-ink)" />
      <rect x="40.5" y="58" width="19" height="8" rx="4" fill="var(--gf-white)" />
      <ellipse cx="50" cy="70" rx="6" ry="4" fill="var(--gf-magenta)" />
      {/* hai tay giơ lên gần mặt, có ngón tay */}
      <g>
        <ellipse cx="16" cy="80" rx="7.5" ry="10" fill="var(--gf-pink)" transform="rotate(-18 16 80)" />
        <line x1="10" y1="88" x2="4" y2="94" stroke="var(--gf-ink)" strokeWidth="2" strokeLinecap="round" />
        <line x1="15" y1="90" x2="11" y2="97" stroke="var(--gf-ink)" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="89" x2="18" y2="97" stroke="var(--gf-ink)" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g>
        <ellipse cx="84" cy="80" rx="7.5" ry="10" fill="var(--gf-pink)" transform="rotate(18 84 80)" />
        <line x1="90" y1="88" x2="96" y2="94" stroke="var(--gf-ink)" strokeWidth="2" strokeLinecap="round" />
        <line x1="85" y1="90" x2="89" y2="97" stroke="var(--gf-ink)" strokeWidth="2" strokeLinecap="round" />
        <line x1="80" y1="89" x2="82" y2="97" stroke="var(--gf-ink)" strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* chân hai màu */}
      <rect x="38" y="94" width="9" height="10" fill="var(--gf-pink)" />
      <rect x="38" y="103" width="9" height="7" rx="3" fill="var(--gf-magenta)" />
      <rect x="53" y="94" width="9" height="10" fill="var(--gf-pink)" />
      <rect x="53" y="103" width="9" height="7" rx="3" fill="var(--gf-magenta)" />
    </svg>
  )
}

export function CoralMegaphoneMascot({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* thân hình thoi bo góc */}
      <rect x="24" y="24" width="52" height="52" rx="16" fill="var(--gf-coral)" transform="rotate(45 50 50)" />
      {/* chân rust */}
      <rect x="36" y="86" width="9" height="16" rx="4" fill="var(--gf-rust)" />
      <rect x="55" y="86" width="9" height="16" rx="4" fill="var(--gf-rust)" />
      {/* má */}
      <ellipse cx="31" cy="58" rx="5" ry="4" fill="var(--gf-rust)" opacity="0.4" />
      <ellipse cx="69" cy="58" rx="5" ry="4" fill="var(--gf-rust)" opacity="0.4" />
      {/* lông mày dữ dằn */}
      <line x1="29" y1="38" x2="43" y2="43" stroke="var(--gf-ink)" strokeWidth="4" strokeLinecap="round" />
      <line x1="71" y1="38" x2="57" y2="43" stroke="var(--gf-ink)" strokeWidth="4" strokeLinecap="round" />
      {/* mắt trắng + con ngươi */}
      <ellipse cx="41" cy="52" rx="6.5" ry="7" fill="var(--gf-white)" />
      <ellipse cx="59" cy="52" rx="6.5" ry="7" fill="var(--gf-white)" />
      <circle cx="38.5" cy="53" r="3.2" fill="var(--gf-ink)" />
      <circle cx="61.5" cy="53" r="3.2" fill="var(--gf-ink)" />
      {/* miệng hô hào (cong hé mở) */}
      <path d="M42 66 Q50 74 58 66" stroke="var(--gf-ink)" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* loa cầm tay bên trái, sóng âm thanh */}
      <g transform="translate(2 58) rotate(-15)">
        <path d="M0 10 L20 0 L20 20 Z" fill="var(--gf-white)" stroke="var(--gf-ink)" strokeWidth="2" strokeLinejoin="round" />
        <rect x="-7" y="6" width="8" height="8" rx="2" fill="var(--gf-ink)" />
        <line x1="24" y1="4" x2="30" y2="0" stroke="var(--gf-ink)" strokeWidth="2" strokeLinecap="round" />
        <line x1="25" y1="10" x2="32" y2="10" stroke="var(--gf-ink)" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="16" x2="30" y2="20" stroke="var(--gf-ink)" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  )
}

export function BlueStarMascot({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* tay chống hông hai bên */}
      <path d="M22 55 Q6 60 10 78 Q13 82 18 78 Q16 64 30 58 Z" fill="var(--gf-blue-star)" />
      <path d="M78 55 Q94 60 90 78 Q87 82 82 78 Q84 64 70 58 Z" fill="var(--gf-blue-star)" />
      {/* một nhánh sao vươn lên như cánh tay */}
      <path d="M58 30 Q72 10 92 8 Q80 22 66 38 Z" fill="var(--gf-blue-star)" />
      {/* thân sao bo tròn: vòng lớn + các múi quanh mép */}
      <circle cx="50" cy="20" r="15" fill="var(--gf-blue-star)" />
      <circle cx="22" cy="35" r="14" fill="var(--gf-blue-star)" />
      <circle cx="78" cy="35" r="14" fill="var(--gf-blue-star)" />
      <circle cx="50" cy="52" r="30" fill="var(--gf-blue-star)" />
      {/* chân */}
      <rect x="30" y="80" width="9" height="16" fill="var(--gf-blue-star)" />
      <rect x="30" y="94" width="9" height="8" rx="3" fill="#3f6f9c" />
      <rect x="61" y="80" width="9" height="16" fill="var(--gf-blue-star)" />
      <rect x="61" y="94" width="9" height="8" rx="3" fill="#3f6f9c" />
      {/* má */}
      <ellipse cx="35" cy="54" rx="5" ry="4" fill="#3f6f9c" opacity="0.4" />
      <ellipse cx="65" cy="54" rx="5" ry="4" fill="#3f6f9c" opacity="0.4" />
      {/* mắt tròn trắng + ngươi đen, sát nhau, ngạc nhiên */}
      <circle cx="42" cy="48" r="6" fill="var(--gf-white)" />
      <circle cx="58" cy="48" r="6" fill="var(--gf-white)" />
      <circle cx="43" cy="49" r="3" fill="var(--gf-ink)" />
      <circle cx="59" cy="49" r="3" fill="var(--gf-ink)" />
      {/* miệng "o" ngạc nhiên */}
      <ellipse cx="50" cy="62" rx="5" ry="6" fill="var(--gf-ink)" />
    </svg>
  )
}

export function PinkStarMascot({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* tay bên hông */}
      <path d="M78 55 Q94 60 90 78 Q87 82 82 78 Q84 64 70 58 Z" fill="var(--gf-pink)" />
      {/* tay trỏ giơ lên bên trái */}
      <path d="M40 28 Q22 6 4 4 Q18 20 34 36 Z" fill="var(--gf-pink)" />
      <circle cx="6" cy="6" r="6" fill="var(--gf-pink)" />
      {/* thân sao bo tròn */}
      <circle cx="50" cy="20" r="15" fill="var(--gf-pink)" />
      <circle cx="22" cy="35" r="14" fill="var(--gf-pink)" />
      <circle cx="78" cy="35" r="14" fill="var(--gf-pink)" />
      <circle cx="50" cy="52" r="30" fill="var(--gf-pink)" />
      {/* chân */}
      <rect x="30" y="80" width="9" height="16" fill="var(--gf-pink)" />
      <rect x="30" y="94" width="9" height="8" rx="3" fill="var(--gf-magenta)" />
      <rect x="61" y="80" width="9" height="16" fill="var(--gf-pink)" />
      <rect x="61" y="94" width="9" height="8" rx="3" fill="var(--gf-magenta)" />
      {/* má */}
      <ellipse cx="35" cy="56" rx="5" ry="4" fill="var(--gf-magenta)" opacity="0.4" />
      <ellipse cx="65" cy="56" rx="5" ry="4" fill="var(--gf-magenta)" opacity="0.4" />
      {/* kính râm sọc */}
      <rect x="33" y="45" width="15" height="10" rx="4" fill="var(--gf-ink)" />
      <rect x="52" y="45" width="15" height="10" rx="4" fill="var(--gf-ink)" />
      <line x1="48" y1="50" x2="52" y2="50" stroke="var(--gf-ink)" strokeWidth="2.5" />
      <line x1="35" y1="52" x2="45" y2="47" stroke="var(--gf-white)" strokeWidth="1.5" opacity="0.7" />
      <line x1="54" y1="52" x2="64" y2="47" stroke="var(--gf-white)" strokeWidth="1.5" opacity="0.7" />
      {/* miệng cười tự tin */}
      <path d="M40 64 Q50 71 60 64" stroke="var(--gf-ink)" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// 5 nhân vật dưới đây khớp với ảnh Leaderboard + Scan QR: bục top-3 dùng
// OrangeWavy/Heart/PinkSquareWave, màn Scan dùng GreenWink + EyesDecoration.

export function OrangeWavyMascot({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* đỉnh đầu lượn sóng 3 múi */}
      <circle cx="30" cy="20" r="14" fill="var(--gf-orange)" />
      <circle cx="50" cy="12" r="15" fill="var(--gf-orange)" />
      <circle cx="70" cy="20" r="14" fill="var(--gf-orange)" />
      {/* thân */}
      <rect x="26" y="24" width="48" height="52" rx="20" fill="var(--gf-orange)" />
      {/* tay giơ chéo lên hai bên kiểu ăn mừng */}
      <path d="M26 40 Q4 30 2 12 Q16 20 30 36 Z" fill="var(--gf-orange)" />
      <path d="M74 40 Q96 30 98 12 Q84 20 70 36 Z" fill="var(--gf-orange)" />
      {/* chân hai màu */}
      <rect x="34" y="80" width="10" height="16" fill="var(--gf-orange)" />
      <rect x="34" y="94" width="10" height="8" rx="3" fill="var(--gf-rust)" />
      <rect x="56" y="80" width="10" height="16" fill="var(--gf-orange)" />
      <rect x="56" y="94" width="10" height="8" rx="3" fill="var(--gf-rust)" />
      {/* má */}
      <ellipse cx="32" cy="56" rx="5" ry="4" fill="var(--gf-rust)" opacity="0.4" />
      <ellipse cx="68" cy="56" rx="5" ry="4" fill="var(--gf-rust)" opacity="0.4" />
      {/* mắt + mày */}
      <circle cx="40" cy="48" r="3.5" fill="var(--gf-ink)" />
      <circle cx="60" cy="48" r="3.5" fill="var(--gf-ink)" />
      <path d="M35 41 Q40 38 45 41" stroke="var(--gf-ink)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M55 41 Q60 38 65 41" stroke="var(--gf-ink)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {/* miệng lè lưỡi */}
      <path d="M38 58 Q50 66 62 58" stroke="var(--gf-ink)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="45" y="60" width="10" height="9" rx="4" fill="var(--gf-rust)" />
    </svg>
  )
}

export function HeartMascot({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* thân hình trái tim */}
      <path
        d="M50 34 C46 16 20 12 12 30 C4 50 24 68 50 92 C76 68 96 50 88 30 C80 12 54 16 50 34 Z"
        fill="var(--gf-coral)"
      />
      {/* chân */}
      <rect x="38" y="88" width="9" height="14" rx="4" fill="var(--gf-rust)" />
      <rect x="53" y="88" width="9" height="14" rx="4" fill="var(--gf-rust)" />
      {/* má */}
      <ellipse cx="33" cy="55" rx="5" ry="4" fill="var(--gf-rust)" opacity="0.4" />
      <ellipse cx="67" cy="55" rx="5" ry="4" fill="var(--gf-rust)" opacity="0.4" />
      {/* mắt nhắm hài lòng */}
      <path d="M32 46 Q38 40 44 46" stroke="var(--gf-ink)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M56 46 Q62 40 68 46" stroke="var(--gf-ink)" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* miệng cười nhẹ */}
      <path d="M42 58 Q50 63 58 58" stroke="var(--gf-ink)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* hai tay ôm trước ngực */}
      <ellipse cx="43" cy="72" rx="9" ry="6" fill="var(--gf-coral)" stroke="var(--gf-ink)" strokeWidth="1.5" transform="rotate(-10 43 72)" />
      <ellipse cx="57" cy="72" rx="9" ry="6" fill="var(--gf-coral)" stroke="var(--gf-ink)" strokeWidth="1.5" transform="rotate(10 57 72)" />
    </svg>
  )
}

export function PinkSquareWaveMascot({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* thân vuông bo góc lớn */}
      <rect x="18" y="14" width="64" height="66" rx="24" fill="var(--gf-pink)" />
      {/* tay vẫy giơ cao bên phải */}
      <path d="M74 30 Q90 10 96 -2 Q84 6 68 22 Z" fill="var(--gf-pink)" />
      {/* tay bên trái thả xuống */}
      <ellipse cx="16" cy="58" rx="8" ry="14" fill="var(--gf-pink)" transform="rotate(12 16 58)" />
      {/* chân */}
      <rect x="34" y="82" width="10" height="14" fill="var(--gf-pink)" />
      <rect x="34" y="94" width="10" height="8" rx="3" fill="var(--gf-magenta)" />
      <rect x="56" y="82" width="10" height="14" fill="var(--gf-pink)" />
      <rect x="56" y="94" width="10" height="8" rx="3" fill="var(--gf-magenta)" />
      {/* má */}
      <ellipse cx="32" cy="50" rx="5" ry="4" fill="var(--gf-magenta)" opacity="0.4" />
      <ellipse cx="68" cy="50" rx="5" ry="4" fill="var(--gf-magenta)" opacity="0.4" />
      {/* mắt tròn + miệng cười */}
      <circle cx="40" cy="44" r="5" fill="var(--gf-white)" />
      <circle cx="60" cy="44" r="5" fill="var(--gf-white)" />
      <circle cx="41" cy="45" r="2.6" fill="var(--gf-ink)" />
      <circle cx="61" cy="45" r="2.6" fill="var(--gf-ink)" />
      <path d="M38 55 Q50 63 62 55" stroke="var(--gf-ink)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function GreenWinkMascot({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* hai tai tròn trên đỉnh đầu */}
      <circle cx="28" cy="18" r="16" fill="var(--gf-green)" />
      <circle cx="72" cy="18" r="16" fill="var(--gf-green)" />
      {/* thân */}
      <circle cx="50" cy="48" r="32" fill="var(--gf-green)" />
      {/* tay giơ lên gần mặt kiểu chào, có ngón */}
      <ellipse cx="18" cy="60" rx="8" ry="13" fill="var(--gf-green)" transform="rotate(-25 18 60)" />
      <line x1="8" y1="48" x2="2" y2="42" stroke="var(--gf-ink)" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="52" x2="7" y2="45" stroke="var(--gf-ink)" strokeWidth="2" strokeLinecap="round" />
      {/* tay còn lại thả sang bên */}
      <ellipse cx="84" cy="66" rx="8" ry="14" fill="var(--gf-green)" transform="rotate(15 84 66)" />
      {/* chân */}
      <rect x="36" y="76" width="10" height="16" fill="var(--gf-green)" />
      <rect x="36" y="90" width="10" height="8" rx="3" fill="var(--gf-green-dark)" />
      <rect x="55" y="76" width="10" height="16" fill="var(--gf-green)" />
      <rect x="55" y="90" width="10" height="8" rx="3" fill="var(--gf-green-dark)" />
      {/* má */}
      <ellipse cx="33" cy="52" rx="5" ry="4" fill="var(--gf-green-dark)" opacity="0.4" />
      <ellipse cx="67" cy="52" rx="5" ry="4" fill="var(--gf-green-dark)" opacity="0.4" />
      {/* mắt nháy: một chevron, một chấm */}
      <path d="M34 44 L42 48 L34 52" stroke="var(--gf-ink)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="62" cy="48" r="4" fill="var(--gf-ink)" />
      {/* miệng chu kiểu "3" nằm ngang */}
      <path d="M46 60 Q50 56 46 52 M46 60 Q50 64 46 68" stroke="var(--gf-ink)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// Cặp mắt trang trí (không có thân) — dùng ở góc header màn Scan.
export function EyesDecoration({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 140 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M18 24 Q30 8 44 20" stroke="var(--gf-ink)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M96 24 Q108 8 122 20" stroke="var(--gf-ink)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <ellipse cx="32" cy="46" rx="22" ry="26" fill="var(--gf-white)" stroke="var(--gf-ink)" strokeWidth="3" />
      <ellipse cx="110" cy="46" rx="22" ry="26" fill="var(--gf-white)" stroke="var(--gf-ink)" strokeWidth="3" />
      <circle cx="24" cy="50" r="11" fill="var(--gf-ink)" />
      <circle cx="102" cy="50" r="11" fill="var(--gf-ink)" />
    </svg>
  )
}
