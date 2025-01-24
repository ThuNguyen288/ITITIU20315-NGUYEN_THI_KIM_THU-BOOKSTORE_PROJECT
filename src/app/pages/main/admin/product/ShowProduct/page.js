'use client';
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({
    Name: "",
    Price: "",
    Stock: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "Name",
    direction: "asc",
  });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/admin/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
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

  const handleDelete = async (ProductID) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/admin/products/${ProductID}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete product");
        }
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.ProductID !== ProductID)
        );
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product.ProductID);
    setUpdatedProduct({
      Name: product.Name,
      Price: product.Price,
      Stock: product.Stock,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (ProductID) => {
    try {
      const response = await fetch(`/api/admin/products/${ProductID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });
      if (!response.ok) {
        throw new Error("Failed to update product");
      }
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.ProductID === ProductID ? { ...product, ...updatedProduct } : product
        )
      );
      setEditingProduct(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // Hàm sắp xếp sản phẩm
  const sortProducts = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedProducts = [...products].sort((a, b) => {
      if (key === "Name") {
        return direction === "asc"
          ? a.Name.localeCompare(b.Name)
          : b.Name.localeCompare(a.Name);
      }
      if (key === "Price") {
        return direction === "asc" ? a.Price - b.Price : b.Price - a.Price;
      }
      if (key === "Stock") {
        return direction === "asc" ? a.Stock - b.Stock : b.Stock - a.Stock;
      }
      if (key === "Sold") {
        return direction === "asc" ? a.Sold - b.Sold : b.Sold - a.Sold;
      }
      return 0;
    });
    setProducts(sortedProducts);
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
            <table className="min-w-full border-collapse border border-gray-200 bg-white shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th
                    className="border border-gray-300 px-4 py-2 text-center w-20"
                  >
                    ID
                  </th>
                  <th
                    className="border border-gray-300 px-4 py-2 text-center w-28"
                  >
                    Image
                  </th>
                  <th
                    className="border border-gray-300 px-4 py-2 text-center cursor-pointer"
                    onClick={() => sortProducts("Name")}
                  >
                    Name{" "}
                    {sortConfig.key === "Name" && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>
                  <th
                    className="border border-gray-300 px-4 py-2 text-center w-28 cursor-pointer"
                    onClick={() => sortProducts("Price")}
                  >
                    Price{" "}
                    {sortConfig.key === "Price" && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>
                  <th
                    className="border border-gray-300 px-4 py-2 text-center w-28 cursor-pointer"
                    onClick={() => sortProducts("Stock")}
                  >
                    Stock{" "}
                    {sortConfig.key === "Stock" && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>
                  <th
                    className="border border-gray-300 px-4 py-2 text-center w-28 cursor-pointer"
                    onClick={() => sortProducts("Sold")}
                  >
                    Sold{" "}
                    {sortConfig.key === "Sold" && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center w-60">
                    <Link href="./AddProduct">
                      <button className="bg-green-500 text-white px-2 py-1 mb-4 rounded mt-4 hover:bg-green-600">
                        Add Product
                      </button>
                    </Link>
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.ProductID} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-center w-20">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center flex justify-center items-center w-28">
                      <img
                        src={product.image || "https://via.placeholder.com/80"}
                        alt={product.Name}
                        className="h-16 border-0 rounded"
                      />
                    </td>

                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {editingProduct === product.ProductID ? (
                        <input
                          type="text"
                          name="Name"
                          value={updatedProduct.Name}
                          onChange={handleInputChange}
                          className="px-2 py-1 w-auto outline-none"
                        />
                      ) : (
                        product.Name
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center w-28">
                      {editingProduct === product.ProductID ? (
                        <input
                          type="number"
                          name="Price"
                          value={updatedProduct.Price}
                          onChange={handleInputChange}
                          className="px-1 py-1 w-24 outline-none"
                        />
                      ) : (
                        product.Price
                      )}
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-2 text-center w-28 font-medium ${
                        product.Stock > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {editingProduct === product.ProductID ? (
                        <input
                          type="number"
                          name="Stock"
                          value={updatedProduct.Stock}
                          onChange={handleInputChange}
                          className="px-2 py-1 w-20 outline-none"
                        />
                      ) : (
                        product.Stock
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center font-medium">
                      {product.Sold}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                      {editingProduct === product.ProductID ? (
                        <button
                          onClick={() => handleSave(product.ProductID)}
                          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditClick(product)}
                          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(product.ProductID)}
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                      >
                        Delete
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
