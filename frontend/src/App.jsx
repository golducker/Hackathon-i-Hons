import { useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async () => {
    if (!message.trim()) return

    setLoading(true)
    setError('')
    setReply('')

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })

      if (!res.ok) {
        throw new Error(`Server trả về lỗi: ${res.status}`)
      }

      const data = await res.json()
      setReply(data.reply)
    } catch (err) {
      setError(`Gửi tin nhắn thất bại: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 16px', fontFamily: 'sans-serif' }}>
      <h1>Hackathon Chat Demo</h1>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập tin nhắn..."
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? 'Đang gửi...' : 'Gửi'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {reply && (
        <div style={{ marginTop: 20, padding: 12, border: '1px solid #ccc', borderRadius: 8 }}>
          <strong>Trả lời:</strong>
          <p>{reply}</p>
        </div>
      )}
    </div>
  )
}

export default App
