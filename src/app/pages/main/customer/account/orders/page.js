'use client';
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Products() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const CustomerID = localStorage.getItem('customerId');
        const response = await fetch(`/api/orders?CustomerID=${CustomerID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data.orders || []); // Handle case where `orders` might be undefined
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);


  return (
    <div className="products py-8 px-2 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">🧾Order History</h1>
  
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-emerald-100 text-black uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-center">#</th>
                <th className="py-3 px-6 text-center">Order Date</th>
                <th className="py-3 px-6 text-center">Total</th>
                <th className="py-3 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-medium">
              {orders.map((order, index) => {
                const formattedDate = new Date(order.OrderDate).toLocaleDateString("en-GB");
                const statusBadge = {
                  Pending: "bg-yellow-200 text-yellow-800",
                  Shipped: "bg-blue-200 text-blue-800",
                  Delivered: "bg-green-200 text-green-800",
                  Cancelled: "bg-red-200 text-red-800",
                };
  
                const badgeStyle = statusBadge[order.Status] || "bg-gray-200 text-gray-700";
  
                return (
                  <tr
                    key={order.OrderID}
                    onClick={() =>
                      (window.location.href = `/pages/main/customer/account/orders/${order.OrderID}`)
                    }
                    className="border-b hover:bg-gray-50 cursor-pointer transition-all"
                  >
                    <td className="py-3 px-6 text-center">{index + 1}</td>
                    <td className="py-3 px-6 text-center">{formattedDate}</td>
                    <td className="py-3 px-6 text-center">{order.Total} VND</td>
                    <td className="py-3 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeStyle}`}>
                        {order.Status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
  
}
