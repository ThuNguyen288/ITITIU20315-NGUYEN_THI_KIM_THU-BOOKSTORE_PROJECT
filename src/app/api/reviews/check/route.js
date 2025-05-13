import db from "../../dbConect";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ProductID = searchParams.get('ProductID');
  const CustomerID = searchParams.get('CustomerID');
  const OrderID = searchParams.get('OrderID');
  if (!ProductID || !CustomerID) {
    return new Response(
      JSON.stringify({ error: 'Missing ProductID or CustomerID' }),
      { status: 400 }
    );
  }

  try {
    const [rows] = await db.execute(
      `SELECT Rating, Comment FROM reviews WHERE ProductID = ? AND CustomerID = ? AND OrderID =? LIMIT 1`,
      [ProductID, CustomerID, OrderID]
    );

    if (rows.length > 0) {
      return new Response(JSON.stringify({ review: rows[0] }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ review: null }), { status: 200 });
    }
  } catch (err) {
    console.error("Error checking review:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
