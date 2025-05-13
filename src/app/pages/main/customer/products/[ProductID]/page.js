'use client';
import RatingDisplay from '@/app/components/DisplayRating';
import HotProducts from '@/app/components/HotProducts';
import RelatedItems from '@/app/components/RelatedItems';
import Link from 'next/link';
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
    if (typeof window !== 'undefined') {
      const storedRoleID = localStorage.getItem('roleId');
      if (storedRoleID) {
        setRoleID(storedRoleID);
        if (storedRoleID === '2') {
          setCanEdit(true);
        }
      }
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
        body: JSON.stringify({
          CustomerID,
          ProductID: product.ProductID,
          Quantity: quantity,
        }),
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
    if (value >= 1 && value <= product.Stock) {
      setQuantity(value);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-2 gap-8">

        {/* Name */}
        <h1 className="font-semibold cursor-pointer" onDoubleClick={() => handleDoubleClick('Name')}>
          {editingField === 'Name' ? (
            <input
              type="text"
              name="Name"
              value={updatedProduct.Name || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              autoFocus
              className="w-full border-none p-2 h-14 outline-none"
            />
          ) : (
            product.Name
          )}
        </h1>

        <div></div>

        {/* Image */}
        <div className="border border-gray-500 w-full h-full flex items-center justify-center">
          <img
            src={product.image || 'https://via.placeholder.com/500'}
            alt={product.Name}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/500'; }}
            className="object-contain mx-auto w-fit"
          />
        </div>

        {/* Details */}
        <div>
          <div className="mt-4">
            {product.CategoryID === 1 ? (
              <>
                <p className="cursor-pointer" onDoubleClick={() => handleDoubleClick('Author')}><strong>Author: </strong> 
                {editingField === 'Author' ? (
                  <input
                    type="text"
                    name="Author"
                    value={updatedProduct.Author || ''}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    autoFocus
                    className="w-full border p-2 outline-none"
                  />
                ) : (
                  product.Author
                )}
                </p>
                <p className="cursor-pointer" onDoubleClick={() => handleDoubleClick('PublishYear')}><strong>Publish Year: </strong> 
                  {editingField === 'PublishYear' ? (
                    <input
                      type="text"
                      name="PublishYear"
                      value={updatedProduct.PublishYear || ''}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      autoFocus
                      className="w-full border p-2 outline-none"
                    />
                  ) : (
                    product.PublishYear
                )}
                </p>
              </>
            ) : product.CategoryID === 2 ? (
              <>
              <p className="cursor-pointer" onDoubleClick={() => handleDoubleClick('PenType')}><strong>Pen Type: </strong> 
                  {editingField === 'PenType' ? (
                    <input
                      type="text"
                      name="PenType"
                      value={updatedProduct.PenType || ''}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      autoFocus
                      className="w-full border p-2 outline-none"
                    />
                  ) : (
                    product.PenType
                )}
                </p>
                <p className="cursor-pointer" onDoubleClick={() => handleDoubleClick('InkColor')}><strong>Ink Color: </strong> 
                  {editingField === 'InkColor' ? (
                    <input
                      type="text"
                      name="InkColor"
                      value={updatedProduct.InkColor || ''}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      autoFocus
                      className="w-full border p-2 outline-none"
                    />
                  ) : (
                    product.InkColor
                )}
                </p>
              </>
            ) : (
              <p><strong>Other Information:</strong> None</p>
            )}
          </div>

          {/* Description */}
          <p
            className="mt-4 cursor-pointer"
            onDoubleClick={() => handleDoubleClick('Description')}
          >
            {editingField === 'Description' ? (
              <textarea
                name="Description"
                value={updatedProduct.Description || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                autoFocus
                className="w-full border h-40 p-2 outline-none"
              />
            ) : (
              product.Description
            )}
          </p>

          {/* Price */}
          <p
            className="mt-12 text-xl font-semibold text-right cursor-pointer"
            onDoubleClick={() => handleDoubleClick('Price')}
          >
            {editingField === 'Price' ? (
              <input
                type="number"
                name="Price"
                value={updatedProduct.Price || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                autoFocus
                className="w-full border p-2 h-14 outline-none text-right"
              />
            ) : (
              `${product.Price} VND`
            )}
          </p>

          {/* Add to cart */}
          {roleID === '1' && (
            product.Stock > 0 ? (
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <label htmlFor="quantity" className="mr-2">
                    Quantity:
                  </label>
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
            ) : (
              <p className="text-red-500 mt-4">Out of stock</p>
            )
          )}

          {/* Tags */}
          {product.Tags && product.Tags.length > 0 && (
            <div className="mt-4">
              <h4 className="text-base font-medium">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {product.Tags.map((tag, index) => (
                  <Link
                    href={`/pages/main/customer/search?attribute=${tag}`}
                    key={index}
                    className="px-3 py-1 no-underline text-black bg-gray-200 rounded-full text-sm"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white p-3 rounded-lg shadow-lg">
          {notification}
        </div>
      )}
      {/*Review and Rating*/}
      <hr className="my-10" />
      <RatingDisplay productId={product.ProductID} />
      {/* Related and Hot products */}
      <hr className="my-10" />
      <RelatedItems currentProduct={product} />
      <hr className="my-10" />
      <HotProducts />
    </div>
  );
};

export default ProductDetail;
