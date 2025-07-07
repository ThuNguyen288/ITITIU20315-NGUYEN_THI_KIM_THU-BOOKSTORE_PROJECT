"use client";

import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { Rating, Typography, Pagination } from "@mui/material";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ProductList({ titleText, titleElement, fetchUrl }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [sortOption, setSortOption] = useState("default");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const containerRef = useRef();

  function ProductLabelByTitle({ title }) {
    const labelMap = {
      "Hot Items": { label: "HOT", bgClass: "bg-pink-200", textClass: "text-pink-900" },
      "New Arrival": { label: "NEW", bgClass: "bg-blue-200", textClass: "text-blue-900" },
      "Best Seller": { label: "BEST", bgClass: "bg-yellow-200", textClass: "text-yellow-900" },
    };
    const label = labelMap[title];
    if (!label) return null;

    return (
      <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold uppercase rounded-full shadow-md ${label.bgClass} ${label.textClass}`}>
        {label.label}
      </div>
    );
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRatings, selectedPrices, sortOption]);

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
        setFilteredProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [fetchUrl]);

  useEffect(() => {
    let filtered = [...products];
    if (selectedRatings.length > 0) {
      filtered = filtered.filter((product) =>
        selectedRatings.some((rating) => Math.floor(product.Rating) === parseInt(rating))
      );
    }
    if (selectedPrices.length > 0) {
      filtered = filtered.filter((product) =>
        selectedPrices.some((priceRange) => {
          const price = parseFloat(product.Price);
          if (priceRange === "under100") return price < 100000;
          if (priceRange === "100to300") return price >= 100000 && price <= 300000;
          if (priceRange === "above300") return price > 300000;
        })
      );
    }
    if (sortOption === "priceAsc") {
      filtered.sort((a, b) => parseFloat(a.Price) - parseFloat(b.Price));
    } else if (sortOption === "priceDesc") {
      filtered.sort((a, b) => parseFloat(b.Price) - parseFloat(a.Price));
    } else if (sortOption === "clicked") {
      filtered.sort((a, b) => (b.Clicked || 0) - (a.Clicked || 0));
    } else if (sortOption === "sold") {
      filtered.sort((a, b) => (b.Sold || 0) - (a.Sold || 0));
    }
    setFilteredProducts(filtered);
  }, [selectedRatings, selectedPrices, sortOption, products]);

  const handleCheckbox = (e, type) => {
    const value = e.target.value;
    const checked = e.target.checked;
    if (type === "rating") {
      setSelectedRatings((prev) => (checked ? [...prev, value] : prev.filter((v) => v !== value)));
    } else if (type === "price") {
      setSelectedPrices((prev) => (checked ? [...prev, value] : prev.filter((v) => v !== value)));
    }
  };

  const handleSortChange = (e) => setSortOption(e.target.value);
  const handlePageChange = (e, page) => setCurrentPage(page);

  const handleAddToCart = async (ProductID) => {
    try {
      const CustomerID = localStorage.getItem("customerId");
      if (!CustomerID) {
        setNotification("Please log in to add items to your cart.");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        return;
      }
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ CustomerID, ProductID, Quantity: 1 }),
      });
      if (!res.ok) throw new Error("Failed to add product to cart");
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
    <div ref={containerRef} className="container mx-auto px-4 py-6 bg-background rounded-xl shadow-sm">
      <h1 className="text-3xl font-bold text-center mb-6 text-primaryCustom-dark">
        {titleElement || titleText}
      </h1>

      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-secondaryCustom-dark z-50 text-gray-900 p-3 rounded-lg shadow-lg">
          {notification}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <span className="text-gray-500 text-lg">Loading...</span>
        </div>
      ) : error ? (
        <p className="text-center text-red-500 text-lg">{error}</p>
      ) : (
        <div className="flex gap-4">
          {(titleText === "All Products" || titleText === "Search Results" || titleText === "Books" || titleText ==="Pens" || titleText === "Others") && (
            <aside className="hidden lg:block w-64 p-4 rounded-lg bg-white">
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 text-neutral-dark">Filter by Rating</h2>
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      value={star}
                      onChange={(e) => handleCheckbox(e, "rating")}
                      className="mr-2 accent-primaryCustom"
                    />
                    <Rating value={star} readOnly size="small" />
                  </div>
                ))}
              </div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 text-neutral-dark">Filter by Price</h2>
                {[
                  { label: "Under 100,000 VND", value: "under100" },
                  { label: "100,000 - 300,000 VND", value: "100to300" },
                  { label: "Above 300,000 VND", value: "above300" },
                ].map((price) => (
                  <div key={price.value} className="mb-2">
                    <input
                      type="checkbox"
                      value={price.value}
                      onChange={(e) => handleCheckbox(e, "price")}
                      className="mr-2 accent-primaryCustom"
                    />
                    {price.label}
                  </div>
                ))}
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2 text-neutral-dark">Sort By</h2>
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="w-full border border-gray-300 rounded px-2 py-1 bg-white"
                >
                  <option value="default">Default</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="clicked">Most Viewed</option>
                  <option value="sold">Best Selling</option>
                </select>
              </div>
            </aside>
          )}

          <div
            className="grid gap-6 px-2 w-full"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              alignItems: "stretch",
            }}
          >
            {currentProducts.map((product) => (
              <div
                key={product.ProductID}
                className="relative bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col h-full"
              >
                <ProductLabelByTitle title={titleText} />
                <Link
                  href={
                    product.source === "google"
                      ? product.PreviewLink || "#"
                      : `/pages/main/customer/products/${product.ProductID}`
                  }
                  target={product.source === "google" ? "_blank" : "_self"}
                  rel={product.source === "google" ? "noopener noreferrer" : undefined}
                >
                  <img
                    loading="lazy"
                    src={product.image || "https://via.placeholder.com/200"}
                    alt={product.Name}
                    className="h-48 w-full object-contain rounded-md bg-neutral-gray-light"
                  />
                </Link>
                <div className="text-center mt-4 flex flex-col justify-between flex-grow">
                  <h2 className="text-sm sm:text-base md:text-lg font-semibold text-neutral-dark line-clamp-2">
                    {product.Name}
                  </h2>

                  {product.source === "google" ? (
                    <p className="mt-1 text-xs sm:text-sm italic text-gray-500">From Google Books</p>
                  ) : (
                    <>
                      <div className="mt-2 flex justify-between items-center px-2 sm:px-4">
                        <div className="text-left">
                          {product.discount && product.discount > 0 ? (
                            <>
                              <span className="block text-xs sm:text-sm line-through text-gray-400">
                                {product.OriginalPrice} VND
                              </span>
                              <span className="block text-sm sm:text-base md:text-lg font-bold text-red-500">
                                {product.Price} VND
                              </span>
                            </>
                          ) : (
                            <span className="text-sm sm:text-base md:text-lg font-bold text-primaryCustom-dark">
                              {product.Price} VND
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleAddToCart(product.ProductID)}
                          className="p-2 bg-secondaryCustom hover:bg-secondaryCustom-dark rounded-full transition"
                        >
                          <ShoppingBagIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3 text-xs sm:text-sm text-gray-600 items-center justify-center px-2 sm:px-4">
                        <Rating value={product.Rating} precision={0.5} readOnly size="small" />
                        <Typography variant="body2" className="text-[10px] sm:text-xs">
                          {product.RatingCount} reviews
                        </Typography>
                      </div>
                    </>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primaryCustom"
            shape="rounded"
          />
        </div>
      )}
    </div>
  );
}
