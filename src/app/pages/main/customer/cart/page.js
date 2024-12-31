// Updated Cart Page
'use client';
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
        if (!CustomerID) {
          console.error("Customer ID not found in localStorage");
          return;
        }

        const response = await fetch(`/api/cart?CustomerID=${CustomerID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }

        const data = await response.json();
        if (!data.cart) {
          setCartItems([]);
          setTotal(0);
          setLoading(false);
          return;
        }

        const normalizedCart = data.cart.map((item) => ({
          ...item,
          Price: parseFloat(item.Price) || 0,
          Quantity: item.Quantity || 0,
        }));

        setCartItems(normalizedCart);
        setLoading(false);
      } catch (err) {
        console.error(err.message);
        setLoading(false);
      }
    }

    fetchCartAndProductDetails();
  }, []);

  useEffect(() => {
    const calculateTotal = () => {
      const totalCost = selectedItems.reduce((total, item) => {
        return total + item.Price * item.Quantity;
      }, 0);
      setTotal(totalCost);
    };

    calculateTotal();
  }, [selectedItems]);

  const handleSelectItem = (productId) => {
    const item = cartItems.find((item) => item.ProductID === productId);
    if (selectedItems.some((selected) => selected.ProductID === productId)) {
      setSelectedItems((prev) => prev.filter((selected) => selected.ProductID !== productId));
    } else {
      setSelectedItems((prev) => [...prev, item]);
    }
  };

  const handleQuantityChange = async (productId, change) => {
    const updatedItems = cartItems.map((item) =>
      item.ProductID === productId
        ? { ...item, Quantity: Math.max(0, item.Quantity + change) }
        : item
    );

    setCartItems(updatedItems);

    try {
      const CustomerID = localStorage.getItem('customerId');
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          CustomerID,
          ProductID: productId,
          Quantity: change,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      const data = await response.json();
      console.log('Quantity updated successfully:', data);
    } catch (error) {
      console.error(error.message);
      alert('Failed to update quantity. Please try again.');
      setCartItems(cartItems);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6">Your Cart</h1>
      {loading ? (
        <p className="text-center">Loading cart and product details...</p>
      ) : cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 gap-6">
            {cartItems.map((item) => (
              <div
                key={item.ProductID}
                className="flex items-center justify-between border border-gray-300 p-4 rounded-lg"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.some((selected) => selected.ProductID === item.ProductID)}
                    onChange={() => handleSelectItem(item.ProductID)}
                    className="mr-4"
                  />
                  <img
                    src={item.Image || 'https://via.placeholder.com/80'}
                    alt={item.Name}
                    className="h-20 object-cover rounded-lg"
                  />
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">{item.Name}</h2>
                    <p className="text-gray-600">${item.Price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleQuantityChange(item.ProductID, -1)}
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span>{item.Quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.ProductID, 1)}
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-right">
            <h2 className="text-xl font-bold">Total: ${total.toFixed(2)}</h2>
            <button
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              onClick={() => {
                localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
                window.location.href = '/checkout';
              }}
              disabled={selectedItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}