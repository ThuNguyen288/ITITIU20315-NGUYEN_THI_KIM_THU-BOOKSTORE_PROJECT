"use client";
import SearchPage from "@/app/components/Search";
import { Suspense } from "react";

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<p className="text-center text-gray-500">Loading search...</p>}>
      <SearchPage/>
    </Suspense>
  );
}
