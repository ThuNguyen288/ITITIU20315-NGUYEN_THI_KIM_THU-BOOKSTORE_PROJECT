import ProductList from "./ProductsCard";

export default function bestSeller() {
  return (
    <ProductList 
    title={
      <div className="flex gap-2 py-2">
        <span className="text-3xl font-extrabold w-full text-white bg-gradient-to-r from-yellow-400 via-orange-300 to-yellow-500 px-6 py-2 rounded-lg shadow-xl">
          👑 Best Seller
        </span>
      </div>
    }
    fetchUrl="/api/bestSeller" />
  )
}
