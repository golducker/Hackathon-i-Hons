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
