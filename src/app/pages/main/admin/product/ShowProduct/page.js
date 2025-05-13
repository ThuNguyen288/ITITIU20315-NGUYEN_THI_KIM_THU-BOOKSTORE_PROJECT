'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import TextField from "@mui/material/TextField";
import RemoveIcon from '@mui/icons-material/Remove';
export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: "Name", direction: "asc" });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/admin/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  const handleDelete = async (ProductID) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/admin/products/${ProductID}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete product");
        setProducts((prev) => prev.filter((p) => p.ProductID !== ProductID));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleDoubleClick = (product, field) => {
    setEditingProduct({ id: product.ProductID, field });
    setUpdatedProduct({ ...product });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = async () => {
    try {
      const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });
      if (!response.ok) throw new Error("Failed to update product");
      setProducts((prev) =>
        prev.map((p) => (p.ProductID === editingProduct.id ? { ...p, ...updatedProduct } : p))
      );
      setEditingProduct(null);
    } catch (err) {
      alert(err.message);
    }
  };
  const router = useRouter();

  const handleAddClick = () => {
    router.push('/pages/main/admin/product/AddProduct'); 
  };

  return (
    <div className="products">
      <h1 className="text-2xl font-bold text-center mb-6 pt-5">Products</h1>
      <div className="container mx-auto px-4">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <button onClick={handleAddClick}>Add</button>
            <table className="min-w-full border border-gray-200 bg-white shadow-md text-center">
              <thead>
                <tr className="bg-gray-100 max-w-full">
                  <th className="border px-4 py-2 w-1/12">ID</th>
                  <th className="border px-4 py-2 w-1/12">Image</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2 w-1/6">Price</th>
                  <th className="border px-4 py-2 w-1/6">Cost</th>
                  <th className="border px-4 py-2 w-1/12">Stock</th>
                  <th className="border px-4 py-2 w-1/12 text-red-500">Delete</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.ProductID} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{index+1}</td>
                    <td className="border px-4 py-2 cursor-pointer">
                      <img
                        src={product.image || "https://via.placeholder.com/200"}
                        alt={product.Name}
                        className="h-20 rounded justify-center mx-auto py-1"
                      />
                    </td>
                    {/* Name Field */}
                    <td
                      className="border px-4 py-2 cursor-pointer"
                      onDoubleClick={() => handleDoubleClick(product, "Name")}
                    >
                      {editingProduct?.id === product.ProductID && editingProduct?.field === "Name" ? (
                        <TextField
                          name="Name"
                          value={updatedProduct.Name}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          onKeyDown={handleKeyDown}
                          autoFocus
                          multiline
                          variant="standard"
                          sx={{ width: "100%", wordBreak: "break-word" }}
                        />
                      ) : (
                        product.Name
                      )}
                    </td>

                    {/* Price Field */}
                    <td
                      className="border px-4 py-2 cursor-pointer"
                      onDoubleClick={() => handleDoubleClick(product, "Price")}
                    >
                      {editingProduct?.id === product.ProductID && editingProduct?.field === "Price" ? (
                        <TextField
                          name="Price"
                          value={updatedProduct.Price}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          onKeyDown={handleKeyDown}
                          autoFocus
                          type="number"
                          variant="standard"
                          sx={{ width: "100%" }}
                        />
                      ) : (
                        product.Price
                      )}
                    </td>

                    {/* Cost Field */}
                    <td
                      className="border px-4 py-2 cursor-pointer"
                      onDoubleClick={() => handleDoubleClick(product, "Cost")}
                    >
                      {editingProduct?.id === product.ProductID && editingProduct?.field === "Cost" ? (
                        <TextField
                          name="Cost"
                          value={updatedProduct.Cost}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          onKeyDown={handleKeyDown}
                          autoFocus
                          type="number"
                          variant="standard"
                          sx={{ width: "100%" }}
                        />
                      ) : (
                        product.Cost
                      )}
                    </td>

                    {/* Stock Field */}
                    <td
                      className="border px-4 py-2 cursor-pointer"
                      onDoubleClick={() => handleDoubleClick(product, "Stock")}
                    >
                      {editingProduct?.id === product.ProductID && editingProduct?.field === "Stock" ? (
                        <TextField
                          name="Stock"
                          value={updatedProduct.Stock}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          onKeyDown={handleKeyDown}
                          autoFocus
                          type="number"
                          variant="standard"
                          sx={{ width: "100%" }}
                        />
                      ) : (
                        product.Stock
                      )}
                    </td>

                    {/* Delete Button */}
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleDelete(product.ProductID)}
                        className="bg-transparent text-red-500 px-4 py-1 rounded hover:bg-red-600"
                      >
                        <RemoveIcon/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}