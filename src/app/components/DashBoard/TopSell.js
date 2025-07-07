"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function TopSell() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/dashboard/BestSeller");
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();

        if (!data.products || !Array.isArray(data.products)) {
          throw new Error("Invalid product data received");
        }

        setProducts(data.products);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-2">
        <h1 className="text-xl font-semibold text-center mb-3">Top Sell In Week</h1>
        <div className="flex justify-center items-center">
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-2">
        <h1 className="text-xl font-semibold text-center mb-3">Top Sell In Week</h1>
        <p className="text-center text-red-600">{error}</p>
      </div>
    );
  }

  // Không có dữ liệu → không render gì cả (hoặc bạn có thể thay bằng "No Data" nếu muốn)
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-4">
        <h1 className="text-xl font-semibold mb-2">Top Selling Products This Week</h1>
        <p className="text-gray-600 text-sm">No products have been sold this week.</p>
      </div>

    ); // hoặc render thông báo: <p className="text-center">No data available.</p>
  }

  return (
    <div className="container mx-auto px-4 py-2">
      <h1 className="text-xl font-semibold text-center mb-3">Top Sell In Week</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.ProductID} className="max-w-xs rounded-lg hover:shadow-lg p-2 pb-2">
            <Link href={`/pages/main/customer/products/${product.ProductID}`}>
              <img
                src={product.image || "https://via.placeholder.com/200"}
                alt={product.Name}
                className="h-24 rounded-t-lg justify-center mx-auto"
              />
            </Link>

            {/* Sold */}
            <div className="text-center mt-2">
              <span className="text-sm font-semibold text-red-500">
                Sold {product.TotalSoldThisWeek}
              </span>
            </div>

            <div className="px-1">
              <h2 className="text-xs font-semibold text-gray-800 text-center mt-2">
                {product.Name}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
