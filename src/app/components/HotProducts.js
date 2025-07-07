'use client';
import ProductList from "./ProductsCard";

export default function HotProducts() {
  return (
    <ProductList 
      titleText="Hot Items"
      titleElement={
        <div className="flex justify-center items-center py-2">
          <span className="inline-block px-6 py-2 rounded-2xl text-accent-pink text-2xl md:text-4xl font-extrabold tracking-wide">
            Hot Items
          </span>
        </div>
      } 
      fetchUrl="/api/HotProducts"
    />
  );
}
