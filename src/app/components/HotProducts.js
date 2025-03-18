'use client';
import ProductList from "./ProductsCard";

export default function HotProducts() {
  return (
    <ProductList title="Hot Items" fetchUrl="/api/HotProducts" />
  )
}
