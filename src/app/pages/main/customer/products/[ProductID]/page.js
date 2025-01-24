'use client';
import HotProducts from '@/app/components/HotProducts';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const ProductDetail = ({ params }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState('');
  const [ProductID, setProductID] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const { ProductID } = await params;
      setProductID(ProductID);
    };

    fetchProductDetails();
  }, [params]);

  useEffect(() => {
    if (!ProductID) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/${ProductID}`);
        const data = await res.json();

        if (data.product) {
          setProduct(data.product);
          await incrementClickCount(ProductID);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Error fetching product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [ProductID]);

  const incrementClickCount = async (ProductID) => {
    try {
      await fetch(`/api/${ProductID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment: 1 }),
      });
    } catch (err) {
      console.error('Error updating ClickCount:', err);
    }
  };

  const handleAddToCart = async () => {
    try {
      const CustomerID = localStorage.getItem('customerId');
      if (!CustomerID) {
        console.error('Customer ID is missing. Please login again.');
        return;
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          CustomerID,
          ProductID: product.ProductID,
          Quantity: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add product to cart');
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

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-2 gap-8">
        <h1 className="text-4xl font-bold">{product.Name}</h1>
        <div></div>
        <div className="border border-gray-500 w-full h-full flex items-center justify-center">
          <img
            src={product.image || 'https://via.placeholder.com/500'}
            alt={product.Name}
            className="h-80 object-contain mx-auto"
          />
        </div>

        <div className="">
          <p className="mt-4 h-36 h-fit">{product.Description}</p>
          <p className="mt-12 text-xl font-semibold text-right">{product.Price} VND</p>
          <p className="mt-4 text-right">Stock: {product.Stock}</p>

          {/* Display tags */}
          {product.Tags && product.Tags.length > 0 && (
            <div className="mt-4">
              <h4 className="text-base font-medium">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {product.Tags.map((tag, index) => (
                  <Link href={`/pages/main/customer/search?attribute=${tag}`} key={index} className="px-3 py-1 no-underline text-black bg-gray-200 rounded-full text-sm">
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <label htmlFor="quantity" className="mr-2">Quantity:</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                min="1"
                max={product.Stock}
                onChange={handleQuantityChange}
                className="border p-2 rounded"
              />
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white p-3 rounded-lg shadow-lg">
          {notification}
        </div>
      )}
      <hr className='my-10'></hr>
      <HotProducts />
    </div>
  );
};

export default ProductDetail;
