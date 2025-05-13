'use client'
import { useEffect, useState } from 'react'

export default function AccountPage() {
  const [customer, setCustomer] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({})

  useEffect(() => {
    const fetchCustomer = async () => {
      const CustomerID = localStorage.getItem('customerId')
      if (!CustomerID) return

      try {
        const res = await fetch(`/api/customer/${CustomerID}`)
        const data = await res.json()
        setCustomer(data)
        setForm(data)
      } catch (error) {
        console.error('Error fetching customer:', error)
      }
    }
    fetchCustomer()
  }, [])
  console.log(customer)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    const CustomerID = localStorage.getItem('customerId')
    try {
      const res = await fetch(`/api/customer/${CustomerID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        alert('Cập nhật thành công!')
        setCustomer(form)
        setIsEditing(false)
      } else {
        alert('Cập nhật thất bại.')
      }
    } catch (err) {
      console.error(err)
      alert('Lỗi khi cập nhật.')
    }
  }

  if (!customer) return <div className="text-center mt-20">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-md">
      <h2 className="text-3xl font-bold text-black mb-6">Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Name" name="Name" value={form.Name} onChange={handleChange} disabled={!isEditing} />
        <InputField label="Email" name="Email" value={form.Email} onChange={handleChange} disabled={!isEditing} />
        <InputField label="Phone Number" name="PhoneNumber" value={form.PhoneNumber} onChange={handleChange} disabled={!isEditing} />
        <InputField label="Date of birth" name="DateOfBirth" type="date" value={form.DateOfBirth?.substring(0, 10)} onChange={handleChange} disabled={!isEditing} />
        <div className="md:col-span-2">
        <InputField label="Address" name="Address" value={form.Address} onChange={handleChange} disabled={!isEditing} />
        </div>
      </div>

      <div className="mt-6 text-right">
        {isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 mr-3 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  )
}

function InputField({ label, name, value, onChange, disabled, type = 'text' }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring"
      />
    </div>
  )
}
