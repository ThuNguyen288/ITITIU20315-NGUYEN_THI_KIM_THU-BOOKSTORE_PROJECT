import db from "../../dbConect";

export async function GET(req) {
  try {
    const [products] = await db.execute(`
      SELECT 
        p.*, 
        pi.ImageURL AS image 
      FROM products p
      LEFT JOIN productimages pi ON p.ProductID = pi.ProductID AND pi.IsPrimary = 1
      WHERE p.CategoryID = 1
    `);

    return new Response(
      JSON.stringify({ products }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching products:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
