import db from "../dbConect";

// GET method: Lấy 8 sản phẩm có Clicked lớn nhất
export async function GET(req) {
  try {
    // Truy vấn MySQL để lấy 8 sản phẩm có số lần Clicked lớn nhất
    const [products] = await db.execute(`
      SELECT 
        p.*, 
        pi.ImageURL AS image 
      FROM products p
      LEFT JOIN productimages pi ON p.ProductID = pi.ProductID AND pi.IsPrimary = 1
      ORDER BY p.Sold DESC
      LIMIT 8
    `);

    return new Response(
      JSON.stringify({ products }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching hot products:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
