import db from "../../../dbConect";

// PUT method to update the order status
export async function PUT(req, context) {
  try {
    const params = await context.params; // Ensure `params` is resolved
    const { OrderID } = params;
    const { Status } = await req.json(); // Parse JSON body

    // Validate input
    if (!OrderID || !Status) {
      return new Response(
        JSON.stringify({ error: "Invalid input: OrderID and Status are required." }),
        { status: 400 }
      );
    }

    // Update order status
    const [result] = await db.execute(
      "UPDATE orders SET Status = ? WHERE OrderID = ?",
      [Status, OrderID]
    );

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Order updated successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating order:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: err.message }),
      { status: 500 }
    );
  }
}

// GET method to fetch order and product details
export async function GET(req, context) {
  try {
    const params = await context.params; // Ensure `params` is resolved
    const { OrderID } = params;

    if (!OrderID) {
      return new Response(
        JSON.stringify({ error: "Invalid input: OrderID is required." }),
        { status: 400 }
      );
    }

    // Fetch order details
    const [orderDetails] = await db.execute(
      "SELECT * FROM orderdetails WHERE OrderID = ?",
      [OrderID]
    );

    if (orderDetails.length === 0) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404 }
      );
    }
    return new Response(
      JSON.stringify({ orderDetails }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching order or products:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: err.message }),
      { status: 500 }
    );
  }
}
