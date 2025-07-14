"use client";
import { useSearchParams } from "next/navigation";
import ProductList from "@/app/components/ProductsCard";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const params = searchParams.toString();
    if (params.includes("attribute=")) {
      setQuery(params);
    } else {
      setQuery("");
    }
    setIsInitialized(true);
  }, [searchParams]);

  const fetchUrl = query ? `/api/search?${query}` : "";

  if (!isInitialized) {
    return null; // Vì Suspense đã có fallback rồi
  }

  return fetchUrl ? (
    <ProductList titleText="Search Results" fetchUrl={fetchUrl} />
  ) : (
    <p className="text-center text-gray-500">No search results</p>
  );
}
