import { NextResponse } from 'next/server';
import db from '../dbConect'; // Đảm bảo đúng đường dẫn tới file kết nối DB

// POST method
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      price,
      stock,
      categoryId,
      penType,
      inkColor,
      author,
      publishYear,
      subCategories,
      images,
    } = body;

    // Validate required fields
    if (!name || !description || !price || !stock || !categoryId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
      });
    }

    // Insert Product
    const product = await db.collection('products').insertOne({
      name,
      description,
      price,
      stock,
      categoryId,
    });

    // Insert Category-specific info (PenType, Book Author)
    if (categoryId === 1) {
      await db.collection('books').insertOne({
        productId: product.insertedId,
        author,
        publishYear,
      });
    } else if (categoryId === 2) {
      await db.collection('pens').insertOne({
        productId: product.insertedId,
        penType,
        inkColor,
      });
    }

    // Insert Subcategories for Books
    if (subCategories && categoryId === 1) {
      subCategories.forEach(async (subCategory) => {
        await db.collection('bookSubCategories').insertOne({
          productId: product.insertedId,
          subCategory,
        });
      });
    }

    // Insert Product Images
    if (images) {
      images.forEach(async (image) => {
        await db.collection('productimages').insertOne({
          productId: product.insertedId,
          imageURL: image.url,
          isPrimary: 0, // default
        });
      });
    }

    // Return a success response
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}