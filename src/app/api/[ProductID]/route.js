import db from "../dbConect";
import { increaseTagScore } from "../increaseTagScore";

// PUT method to update product details or increment click count
export async function PUT(req, { params }) {
  try {
    const { ProductID } = await params;
    const { searchParams } = new URL(req.url);
    const CustomerID = searchParams.get("CustomerID");

    const { Name, Price, Stock, increment } = await req.json();

    if (typeof increment !== "undefined") {
      const [result] = await db.execute(
        "UPDATE products SET Clicked = Clicked + ? WHERE ProductID = ?",
        [increment, ProductID]
      );

      if (result.affectedRows === 0) {
        return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
      }

     if (CustomerID) {
        await increaseTagScore(CustomerID, ProductID, 1);
         await db.execute(`
          INSERT INTO ground_truth_logs (CustomerID, ProductID, ActionType)
          VALUES (?, ?, 'click')
        `, [CustomerID, ProductID]);
      }

      return new Response(JSON.stringify({ success: true, message: "Click count and score updated" }), { status: 200 });
    }

    // Update product info
    if (!ProductID || !Name || !Price || !Stock) {
      return new Response(
        JSON.stringify({ error: "ProductID, Name, Price, and Stock are required" }),
        { status: 400 }
      );
    }

    const [result] = await db.execute(
      "UPDATE products SET Name = ?, Price = ?, Stock = ? WHERE ProductID = ?",
      [Name, Price, Stock, ProductID]
    );

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, message: "Product updated successfully" }), { status: 200 });
  } catch (err) {
    console.error("Error updating product:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error", details: err.message }), { status: 500 });
  }
}

// GET method to fetch product details along with tags
export async function GET(req, { params }) {
  const { ProductID } = await params;

  try {
    const [rows] = await db.execute(`
      SELECT p.*, pi.ImageURL AS image
      FROM products p
      LEFT JOIN productimages pi
      ON p.ProductID = pi.ProductID AND pi.IsPrimary = 1
      WHERE p.ProductID = ?`, [ProductID]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }

    const product = rows[0];

    // Chi tiết thêm theo Category
    if (product.CategoryID === 1) {
      const [bookData] = await db.execute(`SELECT Author, PublishYear FROM products WHERE ProductID = ?`, [ProductID]);
      if (bookData.length > 0) {
        Object.assign(product, bookData[0]);
      }
    } else if (product.CategoryID === 2) {
      const [penData] = await db.execute(`SELECT PenType, InkColor FROM products WHERE ProductID = ?`, [ProductID]);
      if (penData.length > 0) {
        Object.assign(product, penData[0]);
      }
    }

    // Lấy tag
    const [productTags] = await db.execute(`SELECT TagID FROM products WHERE ProductID = ?`, [ProductID]);
    let tagNames = [];

    if (productTags.length > 0 && productTags[0].TagID) {
      const tagIDs = productTags[0].TagID.split(',').map(id => id.trim());
      if (tagIDs.length > 0) {
        const placeholders = tagIDs.map(() => '?').join(',');
        const [tagRows] = await db.execute(`SELECT Name FROM tags WHERE TagID IN (${placeholders})`, tagIDs);
        tagNames = tagRows.map(tag => tag.Name);
      }
    }

    product.Tags = tagNames;

    return new Response(JSON.stringify({ product }), { status: 200 });
  } catch (err) {
    console.error("Error fetching product:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error", details: err.message }), { status: 500 });
  }
}
