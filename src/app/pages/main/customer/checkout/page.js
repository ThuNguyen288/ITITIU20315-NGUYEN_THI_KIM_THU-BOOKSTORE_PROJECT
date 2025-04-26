'use client';
import { useState, useEffect } from 'react';

export default function Checkout() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(20000);
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const validatePhoneNumber = (phone) => /^[0-9]{10,11}$/.test(phone);


  const CustomerID = typeof window !== 'undefined' ? localStorage.getItem('customerId') || '' : '';
  const CustomerName = typeof window !== 'undefined' ? localStorage.getItem('customerName') || '' : '';

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('selectedItems')) || [];
    setSelectedItems(items);
    const totalCost = items.reduce((sum, item) => sum + item.Price * item.Quantity, 0);
    setSubtotal(totalCost);
    setTotal(totalCost + shippingFee - discount);
  }, [shippingFee, discount]);

  useEffect(() => {
    async function fetchData() {
      if (!CustomerID) {
        setError("Missing customer ID");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/customer/${CustomerID}`);
        if (!response.ok) throw new Error("Failed to fetch customer data");
        const data = await response.json();
        setAddress(data.Address || '');
        setPhone(data.PhoneNumber || '');
        setEmail(data.Email || '');
        setName(data.Name || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [CustomerID]);

  const handleApplyVoucher = async () => {
    try {
      const response = await fetch('/api/voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucherCode }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Invalid voucher code');
      setDiscount(result.discountAmount || 0);
      alert('Voucher applied successfully!');
    } catch (err) {
      alert(err.message);
      setDiscount(0);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validatePhoneNumber(phone)) {
      alert('Invalid phone number! Please enter a valid one.');
      return;
    }

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          CustomerID,
          CustomerName,
          items: selectedItems,
          subtotal,
          shippingFee,
          discount,
          total,
          address,
          phone,
          name,
          email,
          paymentMethod,
          voucherCode,
        }),
      });
      if (!response.ok) throw new Error('Failed to place order');
      alert('Order placed successfully!');
      localStorage.removeItem('selectedItems');
      window.location.href = '/';
    } catch (err) {
      alert('Failed to place order. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-6 px-2">
      <h2 className="text-2xl font-bold text-center mb-4">CHECKOUT</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-3 bg-transparent p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          {selectedItems.length === 0 ? (
            <p className="text-gray-600 text-center">Your cart is empty.</p>
          ) : (
            selectedItems.map((item) => (
              <div key={item.ProductID} className="flex items-center bg-white p-3 rounded-lg mb-2">
                <img src={item.Image || "https://via.placeholder.com/80"} alt={item.Name} className="w-16 h-16 rounded" />
                <div className="ml-4">
                  <p className="font-semibold">{item.Name}</p>
                  <p className="text-gray-500 text-sm">{item.Price} VND</p>
                  <p className="text-gray-500 text-sm">Qty: {item.Quantity}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md md:col-span-2">
          <h3 className="text-lg font-semibold">Shipping</h3>
          <input type="text" placeholder="Name" className="w-full border p-2 mt-2 rounded" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="text" placeholder="Address" className="w-full border p-2 mt-2 rounded" value={address} onChange={(e) => setAddress(e.target.value)} />
          <input type="text" placeholder="Phone" className="w-full border p-2 mt-2 rounded" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <h3 className="text-lg font-semibold mt-4">Payment</h3>
          <select className="w-full border p-2 mt-2 rounded" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="cod">Cash on Delivery</option>
            <option value="credit_card">Credit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
          <h3 className="text-lg font-semibold mt-4">Voucher</h3>
          <div className="flex mt-2">
            <input type="text" placeholder="Enter code" className="border p-2 flex-grow rounded" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} />
            <button className="bg-blue-500 text-white px-4 py-2 ml-2 rounded" onClick={handleApplyVoucher}>Apply</button>
          </div>
          <div className="mt-4 text-right">
            <p>Subtotal: {subtotal} VND</p>
            <p>Shipping: {shippingFee} VND</p>
            <p className="text-red-500">Discount: -{discount} VND</p>
            <p className="font-bold">Total: {total} VND</p>
            <button className="bg-green-500 text-white w-full mt-4 py-2 rounded" onClick={handlePlaceOrder}>Place Order</button>
          </div>
        </div>
      </div>
    </div>
  );
}
