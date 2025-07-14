'use client'
import { useState } from 'react'

export default function SendEmailToAllCustomers() {
  const [emailType, setEmailType] = useState('new-arrival')
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!subject || !content) {
      alert('Vui lòng nhập tiêu đề và nội dung email.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: emailType,
          subject,
          content,
          recipients: 'all', // 👈 phía backend sẽ xử lý gửi đến toàn bộ customer
        }),
      })

      if (res.ok) {
        alert('Email đã được gửi đến tất cả khách hàng!')
        setSubject('')
        setContent('')
      } else {
        alert('Gửi email thất bại.')
      }
    } catch (err) {
      console.error('Lỗi khi gửi email:', err)
      alert('Có lỗi xảy ra khi gửi email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Send email to all customer</h2>

      <div className="mb-4">
        <label className="font-medium block mb-1">Type</label>
        <select
          className="w-full border px-4 py-2 rounded-md"
          value={emailType}
          onChange={(e) => setEmailType(e.target.value)}
        >
          <option value="new-arrival">New Arrival</option>
          <option value="best-seller">Best Seller</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="font-medium block mb-1">Title</label>
        <input
          type="text"
          className="w-full border px-4 py-2 rounded-md"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="EX: Top bestseller products in week!"
        />
      </div>

      <div className="mb-4">
        <label className="font-medium block mb-1">Content</label>
        <textarea
          className="w-full border px-4 py-2 rounded-md h-32"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter the content..."
        />
      </div>

      <button
        onClick={handleSend}
        disabled={loading}
        className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${loading ? 'opacity-50' : ''}`}
      >
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div> 
  )
}
