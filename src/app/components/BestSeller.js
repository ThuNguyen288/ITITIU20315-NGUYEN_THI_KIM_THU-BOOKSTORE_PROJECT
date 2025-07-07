import ProductList from "./ProductsCard";

export default function bestSeller() {
  return (
    <ProductList 
     titleText="Best Seller"
      titleElement={
        <div className="flex justify-center py-3">
          <span className="inline-block px-6 py-2 rounded-2xl text-accent-yellow text-2xl md:text-4xl font-extrabold tracking-wide">
            Best Seller
          </span>
        </div>
      }
    fetchUrl="/api/BestSeller" />
  )
}
