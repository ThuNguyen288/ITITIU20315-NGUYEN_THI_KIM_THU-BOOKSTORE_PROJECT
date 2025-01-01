import db from "../../dbConect";

export async function GET() {
  try {
    // Fetch all orders from the database
    const [orders] = await db.execute("SELECT * FROM orders");

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
