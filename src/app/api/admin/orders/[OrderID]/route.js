import db from "../../../dbConect";

// GET method to fetch order info and details
export async function GET(req, context) {
  try {
    const { OrderID } = context.params;

    if (!OrderID) {
      return new Response(
        JSON.stringify({ error: "Invalid input: OrderID is required." }),
        { status: 400 }
      );
    }

    // 1. Lấy thông tin đơn hàng trực tiếp từ bảng orders
    const [orderInfoRows] = await db.execute(
      `SELECT OrderID, OrderDate, Status, Name AS CustomerName, Phone AS PhoneNumber, Address
       FROM orders
       WHERE OrderID = ?`,
      [OrderID]
    );
    console.log(orderInfoRows)

    if (orderInfoRows.length === 0) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404 }
      );
    }

    // 2. Lấy chi tiết sản phẩm trong đơn hàng
    const [orderDetailsRows] = await db.execute(
      `SELECT Od.ProductID, Od.Quantity, 
              P.Name, P.Price,
              PI.ImageURL
       FROM orderdetails AS Od
       JOIN products AS P ON Od.ProductID = P.ProductID
       LEFT JOIN productimages AS PI ON PI.ProductID = P.ProductID AND PI.IsPrimary = 1
       WHERE Od.OrderID = ?`,
      [OrderID]
    );

    return new Response(
      JSON.stringify({
        orderInfo: orderInfoRows[0],
        orderDetails: orderDetailsRows
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
