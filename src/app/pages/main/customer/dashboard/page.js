"use client";
import Banner from "@/app/components/Banner";
import BestSeller from "@/app/components/BestSeller";
import BookOfTheDay from "@/app/components/BookOfTheDay";
import HotProducts from "@/app/components/HotProducts";
import Interesting from "@/app/components/Interesting";
import NewArrival from "@/app/components/NewArrival";

export default function homepage() {
  return (
    <div className="pt-6 space-y-8">
      <Banner />

      {/* Responsive: stack on mobile, side-by-side on large screens */}
      <div className="flex flex-col lg:flex-row gap-6 px-4">
        <div className="flex-1 min-w-0">
          <BookOfTheDay />
        </div>
        <div className="flex-1 min-w-0">
          <NewArrival />
        </div>
      </div>

      <Interesting />
      <HotProducts />
      <BestSeller />
    </div>
  );
}
