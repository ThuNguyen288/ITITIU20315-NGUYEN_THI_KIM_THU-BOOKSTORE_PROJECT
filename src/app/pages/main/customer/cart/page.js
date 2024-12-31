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
          setSelectedItems([]);
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
        setSelectedItems(normalizedCart);  // Sync selectedItems with cartItems initially
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
    // Calculate the new quantity, ensuring it doesn't go below 0
    const updatedItems = cartItems.map((item) =>
      item.ProductID === productId
        ? { ...item, Quantity: Math.max(0, item.Quantity + change) }
        : item
    );
  
    setCartItems(updatedItems);
  
    const updatedSelectedItems = selectedItems.map((item) =>
      item.ProductID === productId
        ? { ...item, Quantity: Math.max(0, item.Quantity + change) }
        : item
    );
  
    setSelectedItems(updatedSelectedItems);
  
    const CustomerID = localStorage.getItem('customerId');
    const newQuantity = Math.max(0, updatedItems.find(item => item.ProductID === productId)?.Quantity);
  
    try {
      if (newQuantity === 0) {
        // If quantity is 0, delete the item from the cart
        const response = await fetch('/api/cart', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            CustomerID,
            ProductID: productId,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to remove item from cart');
        }
  
        const data = await response.json();
        window.location.reload()
        console.log('Item removed successfully:', data);
      } else {
        // Otherwise, update the quantity
        const response = await fetch('/api/cart', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            CustomerID,
            ProductID: productId,
            Quantity: newQuantity, // Send the new quantity, which is non-zero
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update quantity');
        }
  
        const data = await response.json();
        console.log('Quantity updated successfully:', data);
      }
    } catch (error) {
      console.error(error.message);
      alert('Failed to update quantity. Please try again.');
      setCartItems(cartItems);
      setSelectedItems(selectedItems);
    }
  };
  

  const handleRemoveItem = async (productId) => {
    // Optimistically update UI by removing the item from the local state
    const updatedItems = cartItems.filter((item) => item.ProductID !== productId);
    setCartItems(updatedItems);
  
    // Also update the selectedItems state if the item was in selectedItems
    const updatedSelectedItems = selectedItems.filter(
      (item) => item.ProductID !== productId
    );
    setSelectedItems(updatedSelectedItems);
  
    try {
      const CustomerID = localStorage.getItem('customerId');
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          CustomerID,
          ProductID: productId,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to remove item');
      }
  
      const data = await response.json();
      console.log('Item removed successfully:', data);
    } catch (error) {
      console.error(error.message);
      alert('Failed to remove item. Please try again.');
  
      // Revert the changes in case of failure
      setCartItems(cartItems);
      setSelectedItems(selectedItems);
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
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.ProductID}
                className="flex items-center justify-between border border-gray-300 p-4 rounded-lg"
              >
                <div className="flex w-full items-center">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedItems.some((selected) => selected.ProductID === item.ProductID)}
                    onChange={() => handleSelectItem(item.ProductID)}
                    className="mr-4"
                  />
  
                  {/* Product Image */}
                  <div className="w-24">
                    <img
                      src={item.Image || 'https://via.placeholder.com/80'}
                      alt={item.Name}
                      className="h-20 object-cover mx-auto rounded-lg"
                    />
                  </div>
  
                  {/* Product Information */}
                  <div className="ml-4 w-96">
                    <h2 className="text-lg font-semibold truncate">{item.Name}</h2>
                    <p className="text-gray-600">${item.Price.toFixed(2)}</p>
                  </div>
  
                  {/* Quantity Buttons */}
                  <div className="flex items-center space-x-4 ml-auto">
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
  
                  {/* Remove Item Button */}
                  <button
                    onClick={() => handleRemoveItem(item.ProductID)}
                    className="text-red-600 text-xl hover:text-red-800 ml-4"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>

                </div>
              </div>
            ))}
          </div>
  
          {/* Total and Checkout */}
          <div className="mt-6 text-right">
            <h2 className="text-xl font-bold">Total: {total.toFixed(2)} VND</h2>
            <button
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              onClick={() => {
                localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
                window.location.href = '/pages/main/customer/checkout';
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