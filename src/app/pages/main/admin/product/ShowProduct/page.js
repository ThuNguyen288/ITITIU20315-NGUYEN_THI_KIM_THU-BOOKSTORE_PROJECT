"use client"

import Link from "next/link"
// Dữ liệu sản phẩm mẫu

export default function Products(){
    const products = [
        {
          id: 1,
          name: 'Harry Potter',
          price: '100,000 VND',
          status: 'In Stock',
          image: 'https://via.placeholder.com/80',
        },
        {
          id: 2,
          name: 'Conan',
          price: '20,000 VND',
          status: 'Out of stock',
          image: 'https://via.placeholder.com/80',
        },
        {
          id: 3,
          name: 'Computer Science',
          price: '300,000 VND',
          status: 'In Stock',
          image: 'https://via.placeholder.com/80',
        },
      ];
    
    return (
        <div className="products">
            <h1 className="text-2xl font-bold text-center mb-6 pt-5">Products</h1>
            <div className="container mx-auto px-4">
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-200 bg-white shadow-md">
                    <thead>
                        <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Image</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Stock</th>
                        <th className="border border-gray-300 px-4 py-2 text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">{product.id}</td>
                            <td className="border border-gray-300 px-4 py-2">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded"
                            />
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{product.price}</td>
                            <td
                            className={`border border-gray-300 px-4 py-2 font-medium ${
                                product.status === 'In Stock' ? 'text-green-600' : 'text-red-600'
                            }`}
                            >
                            {product.status}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                            <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
                                Edit
                            </button>
                            <button className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
                                Delete
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
            <Link href="./AddProduct">
            <button>
                Add Product
            </button>
            </Link>
        </div>
    )
}