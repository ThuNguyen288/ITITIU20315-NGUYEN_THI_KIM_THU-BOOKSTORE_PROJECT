'use client'

import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css"

const BookOfTheDay = () => {
  const [books, setBooks] = useState([])
  const [notification, setNotification] = useState("")
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/book-of-the-day')
      const data = await res.json()
      setBooks(Array.isArray(data) ? data : [])  // ✅ luôn là mảng
    } catch (error) {
      console.error('Failed to fetch books:', error)
      setBooks([]) 
    }
  }

  fetchBooks()
}, [])


  const handleAddToCart = async (ProductID) => {
    try {
      const CustomerID = localStorage.getItem("customerId")
      if (!CustomerID) {
        setNotification("Please log in to add items to your cart.")
        setShowNotification(true)
        setTimeout(() => setShowNotification(false), 3000)
        return
      }

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ CustomerID, ProductID, Quantity: 1 }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add product to cart.")
      }

      setNotification("Product added to cart successfully!")
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    } catch (err) {
      setNotification(`Error: ${err.message}`)
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    }
  }
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 bg-white rounded-3xl shadow border border-gray-100">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-primaryCustom my-2 tracking-tight">
        Book of the Day
      </h2>

      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-primary/10 text-primary px-4 py-2 rounded-xl shadow-md text-sm z-50">
          {notification}
        </div>
      )}

      <Carousel
        showThumbs={false}
        showStatus={false}
        infiniteLoop
        autoPlay
        interval={6000}
        transitionTime={500}
        showArrows={false}
        swipeable
        emulateTouch
      >
        {books.map((book) => (
          <div
            key={book.ProductID}
            className="flex flex-col md:flex-row items-center gap-6 px-2 sm:px-4 py-5"
          >
            {/* Image */}
            <div className="w-full md:w-1/3 flex justify-center">
              <img
                src={book.ImageURL || "https://via.placeholder.com/200"}
                alt={book.Name}
                className="rounded-xl object-contain h-52 sm:h-60 max-w-full shadow-sm bg-neutral-100 p-2"
              />
            </div>

            {/* Details */}
            <div className="w-full md:w-2/3 text-center md:text-left">
              <h3 className="text-lg sm:text-xl font-semibold text-neutral-800 mb-1 line-clamp-2">
                {book.Name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-5 leading-relaxed">
                {book.Description}
              </p>

              <div className="text-xs text-gray-400 mt-2">
                ⭐ {book.Rating} | 🛒 {book.Sold} sold | 👁️ {book.Clicked} views
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 mt-4">
                <span className="text-base font-bold text-primaryCustom">
                  {book.Price.toLocaleString()} VND
                </span>

                <div className="flex gap-2">
                  <Link href={`/pages/main/customer/products/${book.ProductID}`}>
                    <button className="px-3 py-1.5 rounded-full bg-accent-pink/30 hover:bg-accent-pink/40 text-accent-pink text-sm font-medium transition">
                      View Details
                    </button>
                  </Link>
                  <button
                    onClick={() => handleAddToCart(book.ProductID)}
                    className="px-3 py-1.5 rounded-full bg-lime-200 hover:bg-lime-300 text-lime-900 text-sm font-medium transition flex items-center gap-1"
                  >
                    <ShoppingBagIcon className="h-4 w-4" />
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
