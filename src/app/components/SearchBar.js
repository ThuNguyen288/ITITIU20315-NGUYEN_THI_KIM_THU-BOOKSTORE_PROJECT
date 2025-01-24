'use client';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      // Phân tích từ khóa dựa trên "and"
      const attributes = query.split(" and ").map((attr) => attr.trim());
      const searchParams = new URLSearchParams();

      // Thêm tất cả attribute vào query string
      attributes.forEach((attr) => {
        if (attr) searchParams.append("attribute", attr);
      });

      // Điều hướng đến trang kết quả tìm kiếm
      router.push(`/pages/main/customer/search?${searchParams.toString()}`);

      // Reset input value (chấm dứt input)
      setQuery("");
    }
  };

  return (
    <div className="w-full max-w-md flex items-center relative mr-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Search"
        className="w-full border border-gray-300 rounded-lg py-1 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-gray-300"
      />
      <FaSearch className="absolute left-3 text-gray-400" />
    </div>
  );
}
