'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

export default function PriceSuggestionList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleSuggestions = async () => {
      try {
        // 1. Gửi POST request để tính toán và lưu đề xuất vào DB
        const postRes = await fetch("/api/admin/suggestion", {
          method: "POST",
        });
  
        if (!postRes.ok) throw new Error("Failed to generate price suggestions");
  
        // 2. Sau khi POST xong, gọi GET để lấy danh sách
        const getRes = await fetch("/api/admin/suggestion");
        if (!getRes.ok) throw new Error("Failed to fetch price suggestions");
  
        const data = await getRes.json();
        if (!data.products || !Array.isArray(data.products)) {
          throw new Error("Invalid product data");
        }
  
        setProducts(data.products);
      } catch (err) {
        console.error("Error in suggestion flow:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    handleSuggestions();
  }, []);
  

  return (
    <div className="container mx-auto px-4 py-2">
      <h1 className="text-xl font-semibold text-center mb-3">Price Suggestions</h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <span>Loading...</span>
        </div>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div key={index+1} className="max-w-xs rounded-lg hover:shadow-lg p-2 pb-2 border">
              <Link href={`/pages/main/customer/products/${product.ProductID}`}>
                <img
                  src={product.image || "https://via.placeholder.com/200"}
                  alt={product.Name}
                  className="h-24 rounded-t-lg mx-auto"
                />
              </Link>

              <div className="text-center mt-2">
                <span className="text-sm font-semibold text-gray-800 block">{product.Name}</span>
                <span className="text-xs text-gray-500 block">Sold: {product.Sold}</span>
                <span className="text-xs text-gray-500 block">Clicked: {product.Clicked}</span>
              </div>

              <div className="text-center mt-2 text-sm">
                <p>Current Price: <strong>{product.CurrentPrice}</strong></p>
                <p>
                  Suggested: <span className={`font-semibold ${product.SuggestionType === "INCREASE" ? "text-green-600" : "text-red-600"}`}>
                    {product.SuggestedPrice}
                  </span>
                </p>
                <p className={`text-xs text-gray-500 italic  ${product.SuggestionType === "INCREASE" ? "text-green-600" : "text-red-600"}`}>({product.SuggestionType})</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
