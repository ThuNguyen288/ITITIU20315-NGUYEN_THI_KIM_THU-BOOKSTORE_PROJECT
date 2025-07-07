'use client';

import ProductList from "@/app/components/ProductsCard";

export default function AllProducts() {
    return (
    <ProductList 
      titleText="All Products"
      titleElement={
        <div>
          All Products
        </div>
      } 
    fetchUrl={`/api/products`} />
  )
}
