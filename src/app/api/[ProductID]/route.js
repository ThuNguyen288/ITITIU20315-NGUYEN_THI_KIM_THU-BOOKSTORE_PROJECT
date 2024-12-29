import db from "../dbConect";

// PUT method to update product details or increment click count
export async function PUT(req, { params }) {
  try {
    // Await params to get the ProductID properly
    const { ProductID } = await params;  
    const { Name, Price, Stock, increment } = await req.json();

    // If 'increment' is present, update click count
    if (increment !== undefined) {
      // Ensure proper execution with await
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

// GET method to fetch product details
export async function GET(req, { params }) {
  // Await params to ensure ProductID is retrieved properly
  const { ProductID } = await params;  

  try {
    // Ensure the correct SQL query, parameterized with ProductID
    const [rows] = await db.execute(`
      SELECT p.*, pi.ImageURL AS image
      FROM products p
      LEFT JOIN productimages pi
      ON p.ProductID = pi.ProductID AND pi.IsPrimary = 1
      WHERE p.ProductID = ?`, [ProductID]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ product: rows[0] }), { status: 200 });
  } catch (err) {
    console.error("Error fetching product:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
