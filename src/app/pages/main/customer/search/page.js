// 'use client';
// import { useSearchParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import { ShoppingBagIcon } from '@heroicons/react/24/outline';
// import Link from "next/link";

// export default function SearchPage() {
//   const searchParams = useSearchParams();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [notification, setNotification] = useState('');
//   const [showNotification, setShowNotification] = useState(false);

//   useEffect(() => {
//     // Nếu có search params thì mới gọi API
//     if (searchParams) {
//       const fetchData = async () => {
//         setLoading(true);
//         const query = searchParams.toString(); // Lấy query string từ URL
        
//         try {
//           const res = await fetch(`/api/search?${query}`);
//           const data = await res.json();

//           if (res.ok) {
//             setProducts(data.products || []);
//           } else {
//             setError('Error fetching search results');
//           }
//         } catch (error) {
//           setError('Error fetching search results');
//           console.error("Error fetching search results:", error);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchData();  // Gọi hàm fetchData khi searchParams thay đổi
//     }
//   }, [searchParams]);  // Chạy lại khi searchParams thay đổi

//   const handleAddToCart = async (ProductID) => {
//     try {
//       const CustomerID = localStorage.getItem('customerId');
//       if (!CustomerID) return;

//       const response = await fetch('/api/cart', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           CustomerID: CustomerID,
//           ProductID: ProductID,
//           Quantity: 1,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to add product to cart.');
//       }

//       setNotification('Product added to cart successfully!');
//       setShowNotification(true);

//       setTimeout(() => setShowNotification(false), 3000);
//     } catch (error) {
//       setNotification(`Error: ${error.message}`);
//       setShowNotification(true);

//       setTimeout(() => setShowNotification(false), 3000);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <h1 className="text-2xl font-bold text-center mb-6 mb-10">Search Results</h1>

//       {showNotification && (
//         <div className="fixed bottom-4 right-4 bg-green-600 text-white p-3 rounded-lg shadow-lg" aria-live="assertive">
//           {notification}
//         </div>
//       )}

//       {loading ? (
//         <div className="flex justify-center items-center"> 
//           <span>Loading...</span>
//         </div>
//       ) : error ? (
//         <p className="text-center text-red-600">{error}</p>
//       ) : (
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
//           {products.length === 0 ? (
//             <p className="col-span-full text-center text-gray-600">No products found.</p>
//           ) : (
//             products.map((product, index) => (
//               <div key={index} className="max-w-xs rounded-lg hover:shadow-lg p-2 pb-4">
//                 <Link href={`/pages/main/customer/products/${product.ProductID}`}>
//                   <img
//                     src={product.image || "https://via.placeholder.com/200"}
//                     alt={product.Name}
//                     className="h-48 rounded-t-lg justify-center mx-auto"
//                   />
//                 </Link>

//                 <div className="px-1">
//                   <h2 className="text-lg font-semibold text-gray-800 text-center mt-4">{product.Name}</h2>
//                   <div className="mt-4 mx-4 flex justify-between">
//                     <span className="text-base font-semibold text-gray-900">{product.Price} VND</span>
//                     <button
//                       onClick={() => handleAddToCart(product.ProductID)}
//                       className="px-4 py-2 rounded text-white hover:bg-blue-700"
//                     >
//                       <ShoppingBagIcon className="h-4 w-4 text-black" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import ProductList from "@/app/components/ProductsCard";

export default function SearchPage() {
  return (
    <ProductList title="Result" fetchUrl={`/api/search?${query}`} />
  )
}
