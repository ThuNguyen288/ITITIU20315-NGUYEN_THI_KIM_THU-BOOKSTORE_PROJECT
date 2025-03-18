'use client';
import ProductList from "./ProductsCard";

export default function RelatedItems({ currentProduct }) {
    return (
    <ProductList title="Related Items" fetchUrl={`/api/RelatedItems?productId=${currentProduct.ProductID}`} />
  )
}
