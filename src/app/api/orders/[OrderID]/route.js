import db from "../../dbConect";

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
      const [orderStatus] = await db.execute("SELECT Status from orders WHERE OrderID = ?", [OrderID])
  
      if (orderDetails.length === 0) {
        return new Response(
          JSON.stringify({ error: "Order not found" }),
          { status: 404 }
        );
      }
      return new Response(
        JSON.stringify({
          orderDetails,
          orderStatus: orderStatus[0].Status, // chỉ trả lại chuỗi Status
        }),
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
  