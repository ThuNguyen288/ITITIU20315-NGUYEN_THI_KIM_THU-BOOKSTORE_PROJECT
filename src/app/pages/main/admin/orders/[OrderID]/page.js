'use client';

import { use, useState, useEffect } from 'react';

export default function OrderDetails({ params }) {
  const { OrderID } = use(params); // Dùng use để unwrap params
  const [orderInfo, setOrderInfo] = useState({});
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!OrderID) return;

    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/orders/${OrderID}`);
        if (!res.ok) throw new Error('Failed to fetch order details');
        const data = await res.json();

        setOrderInfo(data.orderInfo); // thông tin người mua
        setStatus(data.orderInfo.Status);
        setItems(data.orderDetails); // thông tin sản phẩm

        // Tổng tiền
        const orderTotal = data.orderDetails.reduce(
          (sum, item) => sum + item.Price * item.Quantity,
          0
        );
        setTotal(orderTotal);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [OrderID]);

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${OrderID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');
      setStatus(newStatus);
      alert('Order status updated!');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Order Details - ID: {OrderID} - Total: {total} VND
      </h1>

      <div className="border rounded-lg p-4 mb-6 bg-gray-50 shadow-sm">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Customer Information</h2>
        <p><strong>Name:</strong> {orderInfo.CustomerName}</p>
        <p><strong>Phone:</strong> {orderInfo.PhoneNumber}</p>
        <p><strong>Address:</strong> {orderInfo.Address}</p>
        <p><strong>Order Date:</strong> {new Date(orderInfo.OrderDate).toLocaleDateString('en-GB')}</p>
        <div className="mt-2">
          <label className="font-medium mr-2">Status:</label>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              status === 'Pending' ? 'bg-red-100 text-red-700' :
              status === 'Shipped' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}
          >
            <option value="Pending">🕒 Pending</option>
            <option value="Shipped">🚚 Shipped</option>
            <option value="Completed">✅ Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {items.map(item => (
          <div key={item.ProductID} className="flex items-center border p-4 rounded-md bg-white shadow-sm">
            <img
              src={item.ImageURL || 'https://via.placeholder.com/80'}
              alt={item.Name}
              className="h-20 w-20 object-cover rounded-lg"
            />
            <div className="ml-4 flex-1">
              <h2 className="text-lg font-semibold">{item.Name}</h2>
              <p className="text-gray-600">Price: {item.Price} VND</p>
              <p className="text-gray-600">Quantity: {item.Quantity}</p>
            </div>
          </div>
        ))}
      </div>      
    </div>
  );
}
