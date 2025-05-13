'use client';

import ProductList from "@/app/components/ProductsCard";

export default function AllProducts() {
    return (
    <ProductList title="All Products" fetchUrl={`/api/products`} />
  )
}
