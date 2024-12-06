"use client"

import Link from "next/link"

export default function Products(){
    return (
        <div className="products">
            <h1>Products</h1>
            <Link href="./AddProduct">
            <button>
                Add Product
            </button>
            </Link>
        </div>
    )
}