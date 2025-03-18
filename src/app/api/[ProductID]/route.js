import db from "../dbConect";

// PUT method to update product details or increment click count
export async function PUT(req, { params }) {
  try {
    const { ProductID } = await params;
    const { Name, Price, Stock, increment } = await req.json();

    // If 'increment' is present, update click count
    if (increment !== undefined) {
      const [result] = await db.execute(
        "UPDATE products SET Clicked = Clicked + ? WHERE ProductID = ?",
        [increment, ProductID]
      );

      if (result.affectedRows === 0) {
        return new Response(
          JSON.stringify({ error: "Product not found" }),
          { status: 404 }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Click count updated successfully" }),
        { status: 200 }
      );
    }

    // Update product details if no 'increment'
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
      return new Response(
        JSON.stringify({ error: "Product not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Product updated successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating product:", err);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: err.message,
      }),
      { status: 500 }
    );
  }
}

// GET method to fetch product details along with tags
export async function GET(req, { params }) {
  const { ProductID } = await params;

  try {
    // Lấy thông tin sản phẩm chính
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
    console.log(product.CategoryID)
    // Kiểm tra Category để lấy thêm thông tin từ bảng books hoặc pens
    if (product.CategoryID === 1) {
      const [bookData] = await db.execute(`
        SELECT Author, PublishYear FROM books WHERE ProductID = ?`, [ProductID]);
      if (bookData.length > 0) {
        product.Author = bookData[0].Author;
        product.PublishYear = bookData[0].PublishYear;
      }
    } else if (product.CategoryID === 2) {
      const [penData] = await db.execute(`
        SELECT PenType, InkColor FROM pens WHERE ProductID = ?`, [ProductID]);
      if (penData.length > 0) {
        product.PenType = penData[0].PenType;
        product.InkColor = penData[0].InkColor;
      }
    }
    console.log(product)
    // Lấy danh sách tags liên quan đến sản phẩm
    const [tags] = await db.execute(`
      SELECT t.Name
      FROM tags t
      JOIN product_tag pt ON t.TagID = pt.TagID
      WHERE pt.ProductID = ?`, [ProductID]);

    // Gán danh sách tags vào product
    product.Tags = tags.map(tag => tag.Name);

    return new Response(JSON.stringify({ product }), { status: 200 });
  } catch (err) {
    console.error("Error fetching product:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}