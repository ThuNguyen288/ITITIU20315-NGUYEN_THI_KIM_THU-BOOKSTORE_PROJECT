import db from "../dbConect";

export async function GET(req) {
  try {
    // Fetch all orders from the database
    const url = new URL(req.url);
    const CustomerID = url.searchParams.get('CustomerID');

    const [orders] = await db.execute("SELECT * FROM orders WHERE CustomerID = ? ORDER BY OrderDate DESC", [CustomerID]);

    return new Response(JSON.stringify({ orders }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Error fetching data:", err.message); // Log error message without exposing sensitive data
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
