"use client";
import { useEffect, useState } from "react";
import Link from "next/link"; // ✅ Import đúng Link component

export default function TrendingTags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch("/api/admin/trending-tags");
        const data = await res.json();
        setTags(data.tags || []);
      } catch (error) {
        console.error("Failed to load trending tags:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTags();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl">
      <h2 className="text-lg font-semibold mb-4 text-pink-600">
        🔥 Trending Tags by Score
      </h2>
      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : tags.length === 0 ? (
        <p className="text-sm text-gray-500">No trending tags found.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Link
              key={index}
              href={`/pages/main/customer/search?attribute=${encodeURIComponent(tag.Name)}`}
              className="px-3 py-1 bg-pink-100 text-pink-800 text-xs font-medium rounded-full hover:bg-pink-200 transition no-underline"
            >
              {tag.Name} ({tag.TotalScore})
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
