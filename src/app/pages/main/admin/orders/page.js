'use client';
import { useEffect, useState } from "react";

export default function Products() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc"); // 'asc' or 'desc'
  const [sortField, setSortField] = useState(null); // 'status' | 'date'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/admin/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const statusPriority = {
    Pending: 1,
    Shipped: 2,
    Completed: 3,
  };

  const sortOrders = (field) => {
    let sorted = [...orders];
    if (field === "status") {
      sorted.sort((a, b) => {
        const valA = statusPriority[a.Status] || 999;
        const valB = statusPriority[b.Status] || 999;
        return sortDirection === "asc" ? valA - valB : valB - valA;
      });
    } else if (field === "date") {
      sorted.sort((a, b) => {
        const dateA = new Date(a.OrderDate);
        const dateB = new Date(b.OrderDate);
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      });
    }
    setOrders(sorted);
    setSortField(field);
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleStatusChange = async (OrderID, newStatus) => {
    try {
      await fetch(`/api/admin/orders/${OrderID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Status: newStatus }),
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.OrderID === OrderID ? { ...order, Status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err.message);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.Email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="products">
      <h1 className="text-3xl font-bold text-center mb-8 pt-5 text-gray-800">Orders Management</h1>
      <div className="container mx-auto px-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <>
            <div className="mb-4 flex justify-end">
              <input
                type="text"
                placeholder="Search by customer email..."
                className="border px-4 py-2 rounded w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
              <table className="min-w-full table-auto text-sm text-gray-700">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                  <tr>
                    <th className="border px-4 py-3 text-center w-16">#</th>
                    <th className="border px-4 py-3 text-center">Customer</th>
                    <th className="border px-4 py-3 text-center">Phone</th>
                    <th
                      className="border px-4 py-3 text-center w-44 cursor-pointer hover:text-blue-500"
                      onClick={() => sortOrders("date")}
                    >
                      Order Date{" "}
                      {sortField === "date" && (
                        <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </th>
                    <th className="border px-4 py-3 text-center w-48">Total</th>
                    <th
                      className="border px-4 py-3 text-center w-48 cursor-pointer hover:text-blue-500"
                      onClick={() => sortOrders("status")}
                    >
                      Status{" "}
                      {sortField === "status" && (
                        <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => {
                    const formattedDate = new Date(order.OrderDate).toLocaleDateString('en-GB');
                    return (
                      <tr key={order.OrderID} className="hover:bg-gray-50 transition cursor-pointer">
                        <td
                          className="border px-4 py-2 text-center font-medium text-blue-600 hover:underline"
                          onClick={() => window.location.href = `/pages/main/admin/orders/${order.OrderID}`}
                        >
                          {index + 1}
                        </td>
                        <td className="border px-4 py-2 text-center">{order.Email}</td>
                        <td className="border px-4 py-2 text-center">{order.Phone}</td>
                        <td className="border px-4 py-2 text-center">{formattedDate}</td>
                        <td className="border px-4 py-2 text-center">{order.Total} VND</td>
                        <td className="border px-4 py-2 text-center">
                          <select
                            value={order.Status}
                            onChange={(e) => handleStatusChange(order.OrderID, e.target.value)}
                            className={`w-full px-3 py-2 rounded-md text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-blue-400
                              ${order.Status === "Pending" ? "bg-red-100 text-red-700 border-red-300" :
                                 order.Status === "Shipped" ? "bg-yellow-100 text-yellow-700 border-yellow-300" :
                                 "bg-green-100 text-green-700 border-green-300"}`}
                          >
                            <option value="Pending">🕒 Pending</option>
                            <option value="Shipped">🚚 Shipped</option>
                            <option value="Completed">✅ Completed</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
