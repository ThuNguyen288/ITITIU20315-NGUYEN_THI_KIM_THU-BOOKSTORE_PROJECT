'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ShoppingBagIcon,  
} from '@heroicons/react/24/outline';

export default function CustomerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/admin/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleAddToCart = async (ProductID) => {
    try {
      const CustomerID = localStorage.getItem('customerId');
      if (!CustomerID) return;

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          CustomerID: CustomerID,
          ProductID: ProductID,
          Quantity: 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product to cart.');
      }

      const result = await response.json();
      setNotification('Product added to cart successfully!');
      setShowNotification(true);

      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      setNotification(`Error: ${error.message}`);
      setShowNotification(true);

      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6 mb-10">All Products</h1>

      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white p-3 rounded-lg shadow-lg">
          {notification}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center"> 
          <span>Loading...</span>
        </div>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.ProductID} className="max-w-xs rounded-lg hover:shadow-lg p-2 pb-4">
                <Link href={`/pages/main/customer/products/${product.ProductID}`}>
                <img
                    src={product.image || "https://via.placeholder.com/200"}
                    alt={product.Name}
                    className="h-48 rounded-t-lg justify-center mx-auto"
                />
                </Link>

                <div className="px-1">
                    <h2 className="text-lg font-semibold text-gray-800 text-center mt-4">{product.Name}</h2>
                    <div className="mt-4 mx-4 flex justify-between">
                    <span className="text-base font-semibold text-gray-900">{product.Price} VND</span>
                    <button
                        onClick={() => handleAddToCart(product.ProductID)}
                        className="px-4 py-2 rounded text-white hover:bg-blue-700"
                    >
                        <ShoppingBagIcon className="h-4 w-4 text-black" />
                    </button>
                    </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
