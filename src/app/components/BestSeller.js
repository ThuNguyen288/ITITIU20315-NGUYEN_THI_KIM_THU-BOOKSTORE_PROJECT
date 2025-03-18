import ProductList from "./ProductsCard";

export default function bestSeller() {
  return (
    <ProductList title="Best Seller" fetchUrl="/api/bestSeller" />
  )
}
