'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    async function fetchCartAndProductDetails() {
      try {
        const CustomerID = localStorage.getItem('customerId');
        if (!CustomerID) return;

        const response = await fetch(`/api/cart?CustomerID=${CustomerID}`);
        if (!response.ok) throw new Error('Failed to fetch cart');

        const data = await response.json();
        const normalizedCart = (data.cart || []).map((item) => ({
          ...item,
          Price: parseFloat(item.Price) || 0,
          Quantity: item.Quantity || 0,
        }));

        setCartItems(normalizedCart);
        setSelectedItems(normalizedCart);
        setLoading(false);
      } catch (err) {
        console.error(err.message);
        setLoading(false);
      }
    }

    fetchCartAndProductDetails();
  }, []);

  useEffect(() => {
    const totalCost = selectedItems.reduce((total, item) => total + item.Price * item.Quantity, 0);
    setTotal(totalCost);
  }, [selectedItems]);

  const handleSelectItem = (productId) => {
    const item = cartItems.find((item) => item.ProductID === productId);
    setSelectedItems((prev) =>
      prev.some((selected) => selected.ProductID === productId)
        ? prev.filter((selected) => selected.ProductID !== productId)
        : [...prev, item]
    );
  };

  const handleQuantityChange = async (productId, change) => {
    const updatedItems = cartItems.map((item) =>
      item.ProductID === productId
        ? { ...item, Quantity: Math.max(0, item.Quantity + change) }
        : item
    );
    setCartItems(updatedItems);

    const updatedSelected = selectedItems.map((item) =>
      item.ProductID === productId
        ? { ...item, Quantity: Math.max(0, item.Quantity + change) }
        : item
    );
    setSelectedItems(updatedSelected);

    const CustomerID = localStorage.getItem('customerId');
    const newQuantity = Math.max(0, updatedItems.find(item => item.ProductID === productId)?.Quantity);

    try {
      const method = newQuantity === 0 ? 'DELETE' : 'PUT';
      const body = newQuantity === 0
        ? { CustomerID, ProductID: productId }
        : { CustomerID, ProductID: productId, Quantity: newQuantity };

      const res = await fetch('/api/cart', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Failed to update cart');
      if (newQuantity === 0) window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemoveItem = async (productId) => {
    setCartItems((prev) => prev.filter((item) => item.ProductID !== productId));
    setSelectedItems((prev) => prev.filter((item) => item.ProductID !== productId));

    try {
      const CustomerID = localStorage.getItem('customerId');
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ CustomerID, ProductID: productId }),
      });

      if (!res.ok) throw new Error('Failed to remove item');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6">Your Cart</h1>
      {loading ? (
        <p className="text-center">Loading cart and product details...</p>
      ) : cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div>
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.ProductID} className="flex items-center justify-between border border-gray-200 p-4 rounded-xl shadow-sm bg-white">
                <div className="flex w-full items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.some((selected) => selected.ProductID === item.ProductID)}
                    onChange={() => handleSelectItem(item.ProductID)}
                    className="mr-4 accent-primaryCustom"
                  />

                  <div className="w-24">
                    <img
                      src={item.Image || 'https://via.placeholder.com/80'}
                      alt={item.Name}
                      className="h-20 object-cover mx-auto rounded-lg"
                    />
                  </div>

                  <div className="ml-4 w-64">
                    <h2 className="text-lg font-semibold truncate text-gray-800">{item.Name}</h2>
                    <p className="text-gray-500 text-sm">{item.Price} VND</p>
                  </div>

                  <div className="flex items-center space-x-4 ml-auto">
                    <button onClick={() => handleQuantityChange(item.ProductID, -1)} className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">-</button>
                    <span>{item.Quantity}</span>
                    <button onClick={() => handleQuantityChange(item.ProductID, 1)} className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">+</button>
                  </div>

                  <button onClick={() => handleRemoveItem(item.ProductID)} className="text-red-500 hover:text-red-700 ml-4">
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-right">
            <h2 className="text-xl font-semibold mb-2">Total: {total} VND</h2>
            <button
              onClick={() => {
                localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
                window.location.href = '/pages/main/customer/checkout';
              }}
              disabled={selectedItems.length === 0}
              className="bg-primaryCustom hover:bg-primaryCustom-dark text-white px-6 py-2 rounded-full font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
