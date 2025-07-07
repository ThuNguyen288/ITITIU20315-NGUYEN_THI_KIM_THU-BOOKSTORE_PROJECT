'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import TextField from "@mui/material/TextField";
import RemoveIcon from '@mui/icons-material/Remove';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: "Name", direction: "asc" });

  const router = useRouter();

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

  const handleAddClick = () => {
    router.push('/pages/main/admin/product/AddProduct'); 
  };

  // Reset Discount về 0
  const handleResetDiscount = async (ProductID) => {
    try {
      const response = await fetch(`/api/admin/products/${ProductID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discount: 0 }),
      });
      if (!response.ok) throw new Error("Failed to reset discount");
      setProducts((prev) =>
        prev.map((p) => (p.ProductID === ProductID ? { ...p, discount: 0 } : p))
      );
    } catch (err) {
      alert(err.message);
    }
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
            <button onClick={handleAddClick} className="bg-rose-500 hover:bg-rose-600 text-white font-medium px-6 py-2 rounded-lg shadow-md transition duration-300 mb-2 float-right flex">
              Add
            </button>
            <table className="min-w-full border border-gray-200 bg-white shadow-md text-center">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 w-1/12">ID</th>
                  <th className="border px-4 py-2 w-1/12">Image</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2 w-1/6">Price</th>
                  <th className="border px-4 py-2 w-1/6">Cost</th>
                  <th className="border px-4 py-2 w-1/12">Stock</th>
                  <th className="border px-4 py-2 w-1/12">Discount (%)</th>
                  <th className="border px-4 py-2 w-1/12 text-red-500">Delete</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.ProductID} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">
                      <img
                        src={product.image || "https://via.placeholder.com/200"}
                        alt={product.Name}
                        className="h-20 rounded mx-auto"
                      />
                    </td>

                    {/* Name */}
                    <td onDoubleClick={() => handleDoubleClick(product, "Name")} className="border px-4 py-2 cursor-pointer">
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
                          sx={{ width: "100%" }}
                        />
                      ) : product.Name}
                    </td>

                    {/* Price */}
                    <td onDoubleClick={() => handleDoubleClick(product, "Price")} className="border px-4 py-2 cursor-pointer">
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
                      ) : product.Price}
                    </td>

                    {/* Cost */}
                    <td onDoubleClick={() => handleDoubleClick(product, "Cost")} className="border px-4 py-2 cursor-pointer">
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
                      ) : product.Cost}
                    </td>

                    {/* Stock */}
                    <td onDoubleClick={() => handleDoubleClick(product, "Stock")} className="border px-4 py-2 cursor-pointer">
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
                      ) : product.Stock}
                    </td>

                    {/* Discount + Reset */}
                    <td className="border px-4 py-2 cursor-pointer">
                      {editingProduct?.id === product.ProductID && editingProduct?.field === "discount" ? (
                        <TextField
                          name="discount"
                          value={updatedProduct.discount}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          onKeyDown={handleKeyDown}
                          autoFocus
                          type="number"
                          variant="standard"
                          sx={{ width: "100%" }}
                        />
                      ) : (
                        <div className="flex items-center justify-center space-x-1">
                          <span onDoubleClick={() => handleDoubleClick(product, "discount")}>{product.discount || 0}</span>
                           <button
                              onClick={() => {
                                // Cập nhật products để hiển thị ngay discount = 0
                                setProducts((prevProducts) =>
                                  prevProducts.map((p) =>
                                    p.ProductID === product.ProductID ? { ...p, discount: 0 } : p
                                  )
                                );

                                // Nếu đang edit sản phẩm này ở discount thì hủy edit
                                if (editingProduct?.id === product.ProductID && editingProduct?.field === "discount") {
                                  setEditingProduct(null);
                                }

                                // Gửi update tới backend (nếu muốn đồng bộ database)
                                fetch(`/api/admin/products/${product.ProductID}`, {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ discount: 0 }),
                                }).catch((err) => console.error("Failed to update discount:", err));
                              }}
                              title="Reset Discount"
                            >
                              <RestartAltIcon
                                className="text-gray-500 hover:text-blue-500 cursor-pointer"
                                fontSize="small"
                              />
                            </button>
                        </div>
                      )}
                    </td>

                    {/* Delete */}
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleDelete(product.ProductID)}
                        className="text-red-500 hover:bg-red-100 p-1 rounded"
                      >
                        <RemoveIcon />
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
