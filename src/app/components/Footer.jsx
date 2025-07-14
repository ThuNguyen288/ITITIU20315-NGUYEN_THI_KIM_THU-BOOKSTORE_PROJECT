"use client";

import Link from "next/link";
import { useState } from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-secondaryCustom-light text-neutral-gray-dark px-6 pt-16 pb-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        {/* Connect */}
        <div>
          <h3 className="text-base font-semibold mb-4">Connect with us</h3>
          <div className="flex gap-4 text-xl text-primaryCustom-dark">
            <Link href="#"><FaFacebookF className="hover:text-primaryCustom" /></Link>
            <Link href="#"><FaInstagram className="hover:text-primaryCustom" /></Link>
            <Link href="#"><FaTwitter className="hover:text-primaryCustom" /></Link>
            <Link href="#"><FaYoutube className="hover:text-primaryCustom" /></Link>
          </div>
        </div>

        {/* Products */}
        <div>
          <h3 className="text-base font-semibold mb-4">Products</h3>
            <p><Link href="/pages/main/customer/products" className="hover:underline no-underline text-zinc-700">All Products</Link></p>
            <p><Link href="/pages/main/customer/products/books" className="hover:underline no-underline text-zinc-700">Books</Link></p>
            <p><Link href="/pages/main/customer/products/pens" className="hover:underline no-underline text-zinc-700">Pens</Link></p>
            <p><Link href="/pages/main/customer/products/others" className="hover:underline no-underline text-zinc-700">Others</Link></p>
        </div>

        {/* About */}
        <div>
          <h3 className="text-base font-semibold mb-4">About</h3>
            <p>Nguyen Thi Kim Thu</p>
            <p>Computer Science – IU</p>
            <p>Supervisor: Assoc. Prof. Nguyen Van Sinh</p>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-base font-semibold mb-4">Get Notified</h3>
          <p className="mb-3">Subscribe to receive updates about new arrivals.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert(`Registered email: ${email}`);
              setEmail("");
            }}
            className="flex gap-2"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-primaryCustom"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primaryCustom text-white text-sm rounded-full hover:bg-primaryCustom-dark transition"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-12 border-t border-gray-300 pt-4 text-xs text-center text-neutral-gray-dark">
        © {new Date().getFullYear()} Rainbow Bookstore – Final year project, Computer Science – International University – VNU-HCM.
        <div className="mt-2 space-x-3">
          <Link href="#" className="hover:underline">Terms</Link>
          <Link href="#" className="hover:underline">Privacy</Link>
          <Link href="#" className="hover:underline">Accessibility</Link>
        </div>
      </div>
    </footer>
  );
}
