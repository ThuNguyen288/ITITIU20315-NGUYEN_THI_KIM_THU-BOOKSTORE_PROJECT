'use client';
import ProductList from "./ProductsCard";

export default function HotProducts() {
  return (
    <ProductList 
      title={
        <div className="flex justify-center items-center gap-2 py-2 w-full">
          <span className="text-3xl w-full font-extrabold text-white bg-gradient-to-r from-red-400 via-orange-300 to-red-400 px-6 py-2 rounded-lg shadow-lg">
            🔥 Hot Items
          </span>
        </div>
      } 
      fetchUrl="/api/HotProducts"
    />
  );
}
