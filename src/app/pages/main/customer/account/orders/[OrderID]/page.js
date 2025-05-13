"use client"
import SubmitReviewForm from '@/app/components/Review';
import { use, useState, useEffect } from 'react';

export default function OrderDetails({ params }) {
  const { OrderID } = use(params); // Dùng `use` để unwrap `params`
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('customerId');
    if (id) setCustomerId(id);
  }, []);

  useEffect(() => {
    if (!OrderID) return;

    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch order details
        const data = await fetch(`/api/orders/${OrderID}`);
        if (!data.ok) {
          throw new Error(`Error fetching order details: ${data.status} ${data.statusText}`);
        }
        const dataDetails = await data.json();

        // Ensure the 'orderStatus' exists in the response data
        if (dataDetails.orderStatus) {
          setOrderStatus(dataDetails.orderStatus); // Set order status
        } else {
          setOrderStatus('Status not available'); // Handle case if no status is found
        }

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

  // Log orderStatus every time it changes
  useEffect(() => {
    console.log("Status: " + orderStatus);
  }, [orderStatus]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (items.length === 0) return <div>Order not found</div>;

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          🧾 Order Details
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Status:{" "}
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            orderStatus === "Completed" ? "bg-green-200 text-green-800"
            : orderStatus === "Pending" ? "bg-yellow-200 text-yellow-800"
            : orderStatus === "Cancelled" ? "bg-red-200 text-red-800"
            : "bg-gray-200 text-gray-800"
          }`}>
            {orderStatus}
          </span>
        </p>
        <p className="text-lg text-gray-700 mt-1">Total: <span className="font-semibold">{total} VND</span></p>
      </div>
  
      <div className="grid grid-cols-1 gap-6">
        {items.map((item) => (
          <div
            key={item.ProductID}
            className="flex-col grid grid-cols-2 sm:flex-row sm:items-center justify-between border border-gray-200 shadow-sm px-4 rounded-xl bg-white hover:shadow-md transition"
          >
            <div className="flex items-center">
              <img
                src={item.ImageURL}
                alt={item.Name}
                className="w-24 object-cover rounded-lg"
              />
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-800">{item.Name}</h2>
                <p className="text-gray-600 text-sm">Price: {item.Price} VND</p>
                <p className="text-gray-600 text-sm">Quantity: {item.Quantity}</p>
              </div>
            </div>
  
            {/* Hiển thị form đánh giá nếu trạng thái là 'Completed' */}
            {orderStatus === 'Completed' && (
              <div className="mt-4 sm:mt-0 sm:ml-6">
                <SubmitReviewForm
                  ProductID={item.ProductID}
                  CustomerID={customerId}
                  OrderID={OrderID}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
  
}
