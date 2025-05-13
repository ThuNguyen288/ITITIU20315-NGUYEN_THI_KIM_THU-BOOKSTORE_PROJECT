// app/components/BookOfTheDay.jsx
'use client'

import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css"

const BookOfTheDay = () => {
  const [books, setBooks] = useState([])

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/book-of-the-day')
        const data = await res.json()
        setBooks(data)
      } catch (error) {
        console.error('Failed to fetch books:', error)
      }
    }

    fetchBooks()
  }, [])

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
    <div className="max-w-2xl mx-auto px-2 my-4 bg-white shadow-md rounded-xl">
      <h2 className="text-3xl font-bold text-center text-lime-600">📚 Book of the Day</h2>
      <Carousel
        showThumbs={false}
        showStatus={false}
        infiniteLoop
        autoPlay
        interval={5000}
        transitionTime={700}
        showArrows={false}
      >
        {books.map((book) => (
          <div
            key={book.ProductID}
            className="items-center grid grid-cols-3 rounded-lg mx-auto pb-4 h-[350px] transition-transform duration-300 hover:scale-[1.01]"
          >
            {/* Image */}
            <div className="justify-center">
              <img
                src={book.ImageURL || "https://via.placeholder.com/200"}
                alt={book.Name}
                className="rounded-lg object-contain h-full max-h-[250px]"
              />
            </div>
  
            {/* Details */}
            <div className="col-span-2 mr-5">
              <h3 className="text-xl font-semibold text-gray-800">{book.Name}</h3>
              <p className="text-sm text-gray-600 line-clamp-6">{book.Description}</p>
              <div className="text-xs text-gray-500">
                ⭐ {book.Rating} | 🛒 {book.Sold} sold | 👁️ {book.Clicked} views
              </div>
  
              <div className="flex items-center justify-between mt-3">
                <span className="text-lg font-bold text-lime-600">{book.Price.toLocaleString()} VND</span>
                <div className="flex gap-2">
                  <Link href={`/pages/main/customer/products/${book.ProductID}`}>
                    <button className="px-4 py-1.5 text-sm bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition">
                      Details
                    </button>
                  </Link>
                  <button
                    onClick={() => handleAddToCart(book.ProductID)}
                    className="px-4 py-1.5 text-sm bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
  
}

export default BookOfTheDay
