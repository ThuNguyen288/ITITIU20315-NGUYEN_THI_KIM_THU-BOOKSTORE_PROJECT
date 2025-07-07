'use client';

import ProductList from "@/app/components/ProductsCard";

export default function AllProducts() {
    return (
    <ProductList 
     titleText="Others"
      titleElement={
        <div>
          Others
        </div>
      } 
    fetchUrl={`/api/products/others`} />
  )
}
