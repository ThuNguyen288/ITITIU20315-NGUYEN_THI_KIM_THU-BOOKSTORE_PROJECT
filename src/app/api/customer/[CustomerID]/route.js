import db from "../../dbConect";

export async function GET(req, { params }) {
  try {
    // Validate params
    if (!params || !params.CustomerID) {
      return new Response(JSON.stringify({ error: "Missing Customer ID" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const customerID = await params.CustomerID; // No need for await
    console.log("Received CustomerID:", customerID);

    // Query the database
    const [rows] = await db.execute(
      `SELECT * FROM customers WHERE CustomerID = ?`, 
      [customerID]
    );

    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ error: "Customer not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Error fetching customer data:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
