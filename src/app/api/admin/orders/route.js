import db from "../../dbConect";

export async function GET() {
  try {
    // Fetch all orders from the database
    const [orders] = await db.execute(`
      SELECT O.* , C.Name
      FROM orders AS O
      LEFT JOIN Customers AS C
      ON O.CustomerID = C.CustomerID
      ORDER BY 
        CASE Status
          WHEN 'Pending' THEN 1
          WHEN 'Shipped' THEN 2
          WHEN 'Completed' THEN 3
          ELSE 4
        END ASC,
        OrderDate ASC;
        `
      );

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
