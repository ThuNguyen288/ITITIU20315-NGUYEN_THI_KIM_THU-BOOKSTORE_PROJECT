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
        const response = await fetch("/api/admin/orders");
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

  const handleStatusChange = async (OrderID, newStatus) => {
    try {
      // Optionally update backend here
      await fetch(`/api/admin/orders/${OrderID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Status: newStatus }),
      });

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.OrderID === OrderID ? { ...order, Status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err.message);
    }
  };

  return (
    <div className="products">
      <h1 className="text-2xl font-bold text-center mb-6 pt-5">Orders</h1>
      <div className="container mx-auto px-4">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200 bg-white shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-center w-20">ID</th>
                  <th className="border border-gray-300 px-4 py-2 text-center w-28">Customer ID</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Order Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-center w-40">Total</th>
                  <th className="border border-gray-300 px-4 py-2 text-center w-40">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => {
                  const formattedDate = new Date(order.OrderDate).toLocaleDateString('en-GB'); // Format date to dd/mm/yyyy
                  return (
                    <tr
                      key={order.OrderID}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td
                        className="border border-gray-300 px-4 py-2 text-center"
                        onClick={() => window.location.href = `/pages/main/admin/orders/${order.OrderID}`}
                      >
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{order.CustomerID}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{formattedDate}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{order.Total} VND</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <select
                          value={order.Status}
                          onChange={(e) => handleStatusChange(order.OrderID, e.target.value)}
                          className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${
                            order.Status === "Pending" ? "bg-red-300" : "bg-green-300"
                          }`}
                          required
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
