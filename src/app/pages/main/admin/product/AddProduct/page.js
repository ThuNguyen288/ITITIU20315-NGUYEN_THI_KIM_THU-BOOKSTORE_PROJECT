'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '/src/app/context/AuthContext'; // Import context

export default function AdminProductInsert() {
  const { isAuthenticated } = useAuth();
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [penType, setPenType] = useState('');
  const [inkColor, setInkColor] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [categories, setCategories] = useState([]); // Store categories
  const [tags, setTags] = useState([]); // Store tags
  const [selectedTags, setSelectedTags] = useState([]); // Store selected tags
  const [images, setImages] = useState([]);
  const router = useRouter();

  // Fetch categories and tags from the API
  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setCategories(data.categories);  // Categories from API
      setTags(data.tags);  // Tags from API
    };

    fetchCategoriesAndTags();
  }, []);

  // Handle image upload
  const handleImageChange = (e) => {
    const files = e.target.files;
    const fileURLs = [...files].map((file) => ({
      url: URL.createObjectURL(file),
    }));
    setImages([...images, ...fileURLs]);
  };
  

  // Handle checkbox change for tags
  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    const tagId = parseInt(value, 10);  // Ensure the tag value is an integer
  
    if (checked) {
      setSelectedTags((prevTags) => [...prevTags, tagId]);  // Add tag
    } else {
      setSelectedTags((prevTags) => prevTags.filter(tag => tag !== tagId));  // Remove tag
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      name: productName,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      categoryId: parseInt(categoryId),
      penType,
      inkColor,
      author,
      publishYear,
      tags: selectedTags,  // Send selected tags
      images: images.map((image) => ({ url: image.url })),
      };

    console.log("Product Data: ", productData);  // Debugging

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        throw new Error('Failed to insert product');
      }

      router.push('./ShowProduct');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Insert New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.CategoryID} value={category.CategoryID}>
                {category.Name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags Checkbox (multiple select) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          <div className="space-y-2">
            {tags.map((tag) => (
              <div key={tag.TagID} className="flex items-center">
                <input
                  type="checkbox"
                  value={tag.TagID}
                  checked={selectedTags.includes(tag.TagID)}  // Ensure the checkbox reflects selected state
                  onChange={handleTagChange}
                  id={`tag-${tag.TagID}`}
                  className="mr-2"
                />
                <label htmlFor={`tag-${tag.TagID}`} className="text-sm">{tag.Name}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Pen Type for Pens */}
        {categoryId === '2' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Pen Type</label>
            <select
              value={penType}
              onChange={(e) => setPenType(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="Ballpoint">Ballpoint</option>
              <option value="Pencil">Pencil</option>
              <option value="ColorPen">ColorPen</option>
            </select>
          </div>
        )}

        {/* Author and Publish Year for Books */}
        {categoryId === '1' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Publish Year</label>
              <input
                type="number"
                value={publishYear}
                onChange={(e) => setPublishYear(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </>
        )}

        {/* Product Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Images</label>
          <input
            type = "file"
            multiple
            onChange={handleImageChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button type="submit" className="mt-4 w-full bg-indigo-600 text-white p-2 rounded-md">
          Submit Product
        </button>
      </form>
    </div>
  );
}
