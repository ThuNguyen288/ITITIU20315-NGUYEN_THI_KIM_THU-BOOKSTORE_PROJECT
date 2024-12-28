"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch products from the backend API
    async function fetchProducts() {
      try {
        const response = await fetch("/api/admin/products"); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.products); // Assuming the response structure has a "products" field
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
    
  }, []);
  console.log(products)
  return (
    <div className="products">
      <h1 className="text-2xl font-bold text-center mb-6 pt-5">Products</h1>
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
                  <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Image</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Stock</th>
                  <th className="border border-gray-300 px-4 py-2 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.ProductID} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{product.ProductID}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <img
                        src={product.image || "https://via.placeholder.com/80"}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{product.Name}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.Price}</td>
                    <td
                      className={`border border-gray-300 px-4 py-2 font-medium ${
                        product.Stock > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.Stock}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                      <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
                        Edit
                      </button>
                      <button className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Link href="./AddProduct">
        <button className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600">
          Add Product
        </button>
      </Link>
    </div>
  );
}
