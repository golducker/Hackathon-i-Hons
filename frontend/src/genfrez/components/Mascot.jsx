import { useState } from 'react'

// Cần team export linh vật từ file thiết kế và bỏ vào frontend/public/mascot.png.
// Chưa có file thật thì hiện khối màu thay thế để không vỡ layout.
// className do nơi gọi truyền vào để tự quyết định kích thước/vị trí (avatar nhỏ vs.
// linh vật lớn trong khối Green Challenges đều dùng chung component này).
export default function Mascot({ className = '' }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={className}>
      {failed ? (
        <div className="gf-mascot-fallback" />
      ) : (
        <img src="/mascot.png" alt="GenFreZ mascot" onError={() => setFailed(true)} />
      )}
    </div>
  )
}
