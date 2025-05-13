"use client";

import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { Rating, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ProductList({ title, fetchUrl }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [columns, setColumns] = useState(4); // Mặc định 4 cột

  const containerRef = useRef();

  // Theo dõi width component
  useEffect(() => {
    const updateColumns = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setColumns(width < 850 ? 2 : 4);
      }
    };

    updateColumns(); // Gọi ngay khi mounted
    window.addEventListener("resize", updateColumns);

    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(fetchUrl);
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
  }, [fetchUrl]);

  const handleAddToCart = async (ProductID) => {
    try {
      const CustomerID = localStorage.getItem("customerId");
      if (!CustomerID) {
        setNotification("Please log in to add items to your cart.");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        return;
      }

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ CustomerID, ProductID, Quantity: 1 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add product to cart.");
      }

      setNotification("Product added to cart successfully!");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (err) {
      setNotification(`Error: ${err.message}`);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  return (
    <div ref={containerRef} className="container mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white p-3 rounded-lg shadow-lg">
          {notification}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center"> 
          <span>Loading...</span>
        </div>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <div className={`grid grid-cols-${columns} gap-6 transition-all duration-300`}>
          {products.map((product) => (
            <div key={product.ProductID} className="max-w-xs rounded-lg hover:shadow-lg p-2 pb-4">
        <Link
          href={product.source === "google"
            ? product.PreviewLink || "#"
            : `/pages/main/customer/products/${product.ProductID}`
          }
          target={product.source === "google" ? "_blank" : "_self"}
          rel={product.source === "google" ? "noopener noreferrer" : undefined}
        >
          <img
            src={product.image || "https://via.placeholder.com/200"}
            alt={product.Name}
            className="h-48 rounded-t-lg justify-center mx-auto"
          />
        </Link>


              <div className="px-1">
                <h2 className="text-lg font-semibold text-gray-800 text-center mt-4 line-clamp-2">{product.Name}</h2>
                {product.source === "google" ? (
                  <div className="mt-2 text-center text-sm italic text-gray-500">From Google Books</div>
                  ) : (
                    <>
                      <div className="mt-4 mx-4 flex justify-between">
                        <span className="text-base font-semibold text-gray-900">{product.Price} VND</span>
                        <button
                          onClick={() => handleAddToCart(product.ProductID)}
                          className="px-4 py-2 rounded text-white hover:bg-emerald-500"
                        >
                          <ShoppingBagIcon className="h-4 w-4 text-black" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 mx-auto text-center">
                        <Rating name="read-only" value={product.Rating} precision={0.5} readOnly size="small" className="pl-4" />
                        <Typography variant="body2">{product.RatingCount} reviews</Typography>
                      </div>
                    </>
                  )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
