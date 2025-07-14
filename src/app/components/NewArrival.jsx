'use client';
import ProductList from "./ProductsCard";

export default function NewArrival() {
    return (
   <ProductList
      titleText="New Arrival"
      titleElement={
        <div className="flex justify-center py-1">
          <span className="inline-block px-6 py-2 rounded-2xl text-primaryCustom text-2xl md:text-4xl font-extrabold tracking-wide">
            New Arrival
          </span>
        </div>
      }
      fetchUrl={`/api/NewArrival`}
    />

  )
}
