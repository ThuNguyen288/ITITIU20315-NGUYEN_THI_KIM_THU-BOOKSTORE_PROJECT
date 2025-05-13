'use client';
import ProductList from "./ProductsCard";

export default function NewArrival() {
    return (
    <ProductList  title={
        <h1 className="text-3xl font-extrabold text-center text-white bg-gradient-to-r from-pink-500 to-yellow-500 px-6 py-2 w-full shadow-lg inline-block">
           New Arrival
        </h1> }
        fetchUrl={`/api/NewArrival`} />
  )
}
