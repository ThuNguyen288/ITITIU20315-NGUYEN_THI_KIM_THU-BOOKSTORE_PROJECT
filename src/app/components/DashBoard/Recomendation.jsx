'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

export default function PriceSuggestionList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch suggestions
  const fetchSuggestions = async () => {
    try {
      const getRes = await fetch("/api/admin/suggestion");
      if (!getRes.ok) throw new Error("Failed to fetch price suggestions");

      const data = await getRes.json();
      if (!data.products || !Array.isArray(data.products)) {
        throw new Error("Invalid product data");
      }
      setProducts(data.products);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleSuggestions = async () => {
      try {
        const postRes = await fetch("/api/admin/suggestion", { method: "POST" });
        if (!postRes.ok) throw new Error("Failed to generate price suggestions");
        await fetchSuggestions();
      } catch (err) {
        console.error("Error in suggestion flow:", err);
        setError(err.message);
      }
    };

    handleSuggestions();
  }, []);

  // Handle Accept Suggestion
  const handleAcceptSuggestion = async (productId, suggestionType) => {
    if (suggestionType === "NO_CHANGE") {
      alert("This is a suggestion for review only, no price change.");
      return;
    }

    try {
      const res = await fetch(`/api/admin/suggestion/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, suggestionType }),
      });

      if (!res.ok) throw new Error("Failed to accept suggestion");

      alert("Suggestion accepted!");

      // Remove from UI
      setProducts((prev) => prev.filter(item => item.ProductID !== productId));

    } catch (err) {
      console.error("Error accepting suggestion:", err);
      alert("Error accepting suggestion");
    }
  };

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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <div key={index} className="max-w-xs rounded-lg hover:shadow-lg p-2 pb-2 border">
              <Link href={`/pages/main/customer/products/${product.ProductID}`}>
                <img
                  src={product.image || "https://via.placeholder.com/200"}
                  alt={product.Name}
                  className="h-24 rounded-t-lg mx-auto"
                />
              </Link>

              <div className="text-center mt-2 text-xs">
                <p>Current Price: <strong>{product.CurrentPrice}</strong></p>
                {product.SuggestionType !== "NO_CHANGE" && (
                <p> Suggested:{" "}
                  <span
                    className={`font-semibold ${
                      product.SuggestionType === "INCREASE"
                        ? "text-green-600"
                        : product.SuggestionType === "DECREASE"
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {product.SuggestedPrice}
                  </span>
                </p>
              )}
                <p className={`text-xs italic ${
                  product.SuggestionType === "INCREASE"
                    ? "text-green-600"
                    : product.SuggestionType === "DECREASE"
                    ? "text-red-600"
                    : "text-gray-500"
                }`}>
                  ({product.SuggestionType === "NO_CHANGE" ? "For Review" : product.SuggestionType})
                </p>

                {product.SuggestionType !== "NO_CHANGE" ? (
                  <button
                    onClick={() => handleAcceptSuggestion(product.ProductID, product.SuggestionType)}
                    className="mt-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
                  >
                    Accept Suggestion
                  </button>
                ) : (
                  <p className="text-gray-500 mt-1 text-xs italic">
                    {product.Reason}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
