'use client';

import { use, useState, useEffect } from 'react';

export default function OrderDetails({ params }) {
  const { OrderID } = use(params); // Dùng `use` để unwrap `params`
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!OrderID) return;

    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch order details
        const data = await fetch(`/api/admin/orders/${OrderID}`);
        if (!data.ok) {
          throw new Error(`Error fetching order details: ${data.status} ${data.statusText}`);
        }
        const dataDetails = await data.json();
        
        // Fetch details of each product
        const productDetailsPromises = dataDetails.orderDetails.map(async (orderItem) => {
          const productData = await fetch(`/api/${orderItem.ProductID}`);
          if (!productData.ok) {
            throw new Error(`Error fetching product details for ProductID: ${orderItem.ProductID}`);
          }
          const product = await productData.json();
          return {
            ...orderItem,
            Name: product.product.Name,
            ImageURL: product.product.image || 'https://via.placeholder.com/80',
            Price: product.product.Price,
          };
        });

        const detailedItems = await Promise.all(productDetailsPromises);
        setItems(detailedItems);

        // Tính toán tổng giá trị đơn hàng
        const orderTotal = detailedItems.reduce((sum, item) => {
          return sum + (item.Price * item.Quantity);
        }, 0);
        setTotal(orderTotal);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [OrderID]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (items.length === 0) return <div>Order not found</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6">Order ID: {OrderID}, Total: {total.toFixed(2)} VND</h1>
      <div className="grid grid-cols-1 gap-6">
        {items.map((item) => (
          <div
            key={item.ProductID}
            className="flex items-center justify-between border border-gray-300 p-4 rounded-lg"
          >
            <div className="flex items-center">
              <img
                src={item.ImageURL}
                alt={item.Name}
                className="h-20 object-cover rounded-lg"
              />
              <div className="ml-4">
                <h2 className="text-lg font-semibold">{item.Name}</h2>
                <p className="text-gray-600">{item.Price} VND</p>
                <p className="text-gray-600">Quantity: {item.Quantity}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
