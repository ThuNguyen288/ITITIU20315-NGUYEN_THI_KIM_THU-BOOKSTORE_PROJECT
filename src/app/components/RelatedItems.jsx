'use client';
import ProductList from "./ProductsCard";

export default function RelatedItems({ currentProduct }) {
    return (
    <ProductList 
    titleText="Related Items" 
    titleElement=
    {
      <div>
        Related Items
      </div>
    } 
    fetchUrl={`/api/RelatedItems?productId=${currentProduct.ProductID}`} />
  )
}
