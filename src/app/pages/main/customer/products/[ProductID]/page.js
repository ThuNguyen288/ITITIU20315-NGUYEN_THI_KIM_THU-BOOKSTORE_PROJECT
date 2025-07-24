'use client';

import RatingDisplay from '@/app/components/DisplayRating';
import HotProducts from '@/app/components/HotProducts';
import RelatedItems from '@/app/components/RelatedItems';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const ProductDetail = ({ params }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState('');
  const [roleID, setRoleID] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { ProductID } = await params;
        const roleID = localStorage.getItem('roleId');
        const CustomerID = localStorage.getItem('customerId');

        const res = await fetch(`/api/${ProductID}`);
        if (!res.ok) throw new Error('Failed to fetch product details');
        const data = await res.json();
        if (!data.product) throw new Error('Product not found');

        setProduct(data.product);

        if (roleID === '1') {
          await fetch(`/api/${ProductID}?CustomerID=${CustomerID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ increment: 0.5 }),
          });
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params]);

  useEffect(() => {
    const storedRoleID = localStorage.getItem('roleId');
    if (storedRoleID) {
      setRoleID(storedRoleID);
      if (storedRoleID === '2') setCanEdit(true);
    }
  }, []);

  const handleDoubleClick = (field) => {
    if (canEdit) {
      setEditingField(field);
      setUpdatedProduct({ ...product });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = async () => {
    try {
      const res = await fetch(`/api/${product.ProductID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      if (!res.ok) throw new Error('Failed to update product');
      setProduct(updatedProduct);
      setEditingField(null);
      router.refresh();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddToCart = async () => {
    try {
      const CustomerID = localStorage.getItem('customerId');
      if (!CustomerID) throw new Error('Customer ID is missing. Please login again.');

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ CustomerID, ProductID: product.ProductID, Quantity: quantity }),
      });

      if (!response.ok) throw new Error('Failed to add product to cart');

      setNotification('Product added to cart successfully!');
    } catch (err) {
      setNotification(`Error: ${err.message}`);
    } finally {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 1 && value <= product.Stock) setQuantity(value);
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
          <img
            src={product.image || 'https://via.placeholder.com/500'}
            alt={product.Name}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/500'; }}
            className="w-full h-auto object-contain max-h-[500px]"
          />
        </div>

        <div className="flex flex-col justify-between">
          <h1
            className="text-2xl sm:text-3xl font-bold mb-4 cursor-pointer"
            onDoubleClick={() => handleDoubleClick('Name')}
          >
            {editingField === 'Name' ? (
              <input
                type="text"
                name="Name"
                value={updatedProduct.Name || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                autoFocus
                className="w-full border p-2 rounded"
              />
            ) : (
              product.Name
            )}
          </h1>

          <div className="space-y-2 text-gray-700 text-sm">
            {product.CategoryID === 1 ? (
              <>
                <p onDoubleClick={() => handleDoubleClick('Author')}><strong>Author:</strong> {editingField === 'Author' ? <input name="Author" value={updatedProduct.Author || ''} onChange={handleInputChange} onBlur={handleBlur} className="w-full border p-2 rounded" autoFocus /> : product.Author}</p>
                <p onDoubleClick={() => handleDoubleClick('PublishYear')}><strong>Publish Year:</strong> {editingField === 'PublishYear' ? <input name="PublishYear" value={updatedProduct.PublishYear || ''} onChange={handleInputChange} onBlur={handleBlur} className="w-full border p-2 rounded" autoFocus /> : product.PublishYear}</p>
              </>
            ) : product.CategoryID === 2 ? (
              <>
                <p onDoubleClick={() => handleDoubleClick('PenType')}><strong>Pen Type:</strong> {editingField === 'PenType' ? <input name="PenType" value={updatedProduct.PenType || ''} onChange={handleInputChange} onBlur={handleBlur} className="w-full border p-2 rounded" autoFocus /> : product.PenType}</p>
                <p onDoubleClick={() => handleDoubleClick('InkColor')}><strong>Ink Color:</strong> {editingField === 'InkColor' ? <input name="InkColor" value={updatedProduct.InkColor || ''} onChange={handleInputChange} onBlur={handleBlur} className="w-full border p-2 rounded" autoFocus /> : product.InkColor}</p>
              </>
            ) : <p><strong>Other Information:</strong> None</p>}
          </div>

          <div className="mt-4">
            {editingField === 'Description' ? (
              <textarea name="Description" value={updatedProduct.Description || ''} onChange={handleInputChange} onBlur={handleBlur} className="w-full border h-36 p-3 rounded outline-none text-sm" autoFocus />
            ) : (
              <p className="text-sm text-gray-600 leading-relaxed cursor-pointer" onDoubleClick={() => handleDoubleClick('Description')}>
                {product.Description}
              </p>
            )}
          </div>

         <div className="mt-6 text-right">
            <div className="flex justify-end items-center gap-4">
              <p
                className={`text-xl font-semibold cursor-pointer ${
                  Number(product.discount) > 0 ? 'line-through text-gray-400' : ''
                }`}
                onDoubleClick={() => handleDoubleClick('OriginalPrice')}
              >
                {editingField === 'OriginalPrice' ? (
                  <input
                    type="number"
                    name="OriginalPrice"
                    value={updatedProduct.OriginalPrice || ''}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="border p-2 w-32 text-right rounded"
                    autoFocus
                  />
                ) : (
                  `${product.OriginalPrice} VND`
                )}
              </p>

              {Number(product.discount) > 0 && (
                <p
                  className="text-xl font-semibold cursor-pointer text-red-500"
                  onDoubleClick={() => handleDoubleClick('discount')}
                >
                  {editingField === 'discount' ? (
                    <input
                      type="number"
                      name="discount"
                      value={updatedProduct.discount || ''}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className="border p-2 w-24 text-right rounded text-red-500"
                      autoFocus
                    />
                  ) : (
                    `-${product.discount} %`
                  )}
                </p>
              )}
            </div>

            {Number(product.discount) > 0 && (
              <p className="text-xl font-semibold text-red-500 mt-2">
                {product.Price} VND
              </p>
            )}
          </div>

          {roleID === '1' && (
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="quantity" className="text-sm font-medium">Quantity:</label>
                <input type="number" id="quantity" value={quantity} min="1" max={product.Stock} onChange={handleQuantityChange} className="border rounded px-3 py-1 w-20 text-sm" />
              </div>
              <button onClick={handleAddToCart} className="bg-primaryCustom text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-primaryCustom-dark transition">
                Add to Cart
              </button>
            </div>
          )}

          {product.Tags?.length > 0 && (
            <div className="mt-6">
              <h4 className="text-base font-medium mb-2">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {product.Tags.map((tag, index) => (
                  <Link key={index} href={`/pages/main/customer/search?attribute=${tag}`} className="px-3 py-1 bg-pink-100 text-pink-800 text-xs font-medium rounded-full hover:bg-pink-200 transition no-underline">
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white p-3 rounded-lg shadow-lg">
          {notification}
        </div>
      )}

      <hr className="my-10" />
      <RatingDisplay productId={product.ProductID} />
      <hr className="my-10" />
      <RelatedItems currentProduct={product} />
      <hr className="my-10" />
      <HotProducts />
    </div>
  );
};

export default ProductDetail;
