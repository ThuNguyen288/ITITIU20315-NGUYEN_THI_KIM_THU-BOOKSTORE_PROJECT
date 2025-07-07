'use client';

import ProductList from "@/app/components/ProductsCard";

export default function AllProducts() {
    return (
    <ProductList 
      titleText="Books"
      titleElement={
        <div>
          Books
        </div>
      } 
      fetchUrl={`/api/products/books`} />
  )
}
