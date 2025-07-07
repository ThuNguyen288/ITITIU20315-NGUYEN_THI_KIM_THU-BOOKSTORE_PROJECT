'use client';

import ProductList from "@/app/components/ProductsCard";

export default function AllProducts() {
    return (
    <ProductList 
     titleText="Pens"
      titleElement={
        <div>
          Pens
        </div>
      } 
    fetchUrl={`/api/products/pens`} />
  )
}
