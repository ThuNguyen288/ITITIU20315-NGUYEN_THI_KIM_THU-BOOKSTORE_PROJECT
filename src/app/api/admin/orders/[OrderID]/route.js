import db from "../../../dbConect";

// PUT method to update product details or increment click count
export async function PUT(req, { params }) {
  try {
    // Await params to get the ProductID properly
    const { OrderID } = await params;  
    const { Status } = await req.json();


    // Update product details if no 'increment'
    
    const [result] = await db.execute(
      "UPDATE orders SET Status = ? WHERE OrderID = ?",
      [Status, OrderID]
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
  const { OrderID } = await params;  

  try {
    // Ensure the correct SQL query, parameterized with ProductID
    const [rows] = await db.execute(`
      SELECT * FROM orderdetails
      WHERE OrderID = ?`, [OrderID]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ product: rows[0] }), { status: 200 });
  } catch (err) {
    console.error("Error fetching order:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
