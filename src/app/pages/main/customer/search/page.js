"use client";
import { useSearchParams } from "next/navigation";
import ProductList from "@/app/components/ProductsCard";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(null); // null để tránh render sớm
  const [isInitialized, setIsInitialized] = useState(false); // Kiểm soát lần render đầu

  useEffect(() => {
    const params = searchParams.toString();
    
    if (params.includes("attribute=")) {
      setQuery(params);
    } else {
      setQuery(""); // Trường hợp không có từ khóa tìm kiếm
    }

    setIsInitialized(true); // Đánh dấu đã xử lý query
  }, [searchParams]);

  const fetchUrl = query ? `/api/search?${query}` : "";

  if (!isInitialized) {
    return <p className="text-center text-gray-500">Loading search...</p>;
  }

  return fetchUrl ? <ProductList title="Search Results" fetchUrl={fetchUrl} /> : <p className="text-center text-gray-500">No search results</p>;
}
