// Checkout Page
'use client';
import { useState, useEffect } from 'react';

export default function Checkout() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('selectedItems')) || [];
    setSelectedItems(items);
    const totalCost = items.reduce((sum, item) => sum + item.Price * item.Quantity, 0);
    setTotal(totalCost);
  }, []);
  const handlePlaceOrder = async () => {
    try {
      const CustomerID = localStorage.getItem('customerId');
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          CustomerID,
          items: selectedItems,
          total,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const data = await response.json();
      alert('Order placed successfully!');
      localStorage.removeItem('selectedItems');
      window.location.href = '/';
    } catch (err) {
      console.error(err.message);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-center mb-6">Checkout</h1>
          <div className="grid grid-cols-1 gap-6">
            {selectedItems.map((item) => (
              <div key={item.ProductID} className="flex items-center justify-between border border-gray-300 p-4 rounded-lg">
                <div className="flex items-center">
                  <img
                    src={item.Image || 'https://via.placeholder.com/80'}
                    alt={item.Name}
                    className="h-20 object-cover rounded-lg"
                  />
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">{item.Name}</h2>
                    <p className="text-gray-600">{item.Price.toFixed(2)} VND</p>
                    <p className="text-gray-600">Quantity: {item.Quantity}</p>
                  </div>
                  </div>
                </div>
            ))}
          </div>
          <div className="mt-6 text-right">
            <h2 className="text-xl font-bold">Total: ${total.toFixed(2)}</h2>
            <button
              onClick={handlePlaceOrder}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Place Order
            </button>
          </div>
      </div>
  );
}
