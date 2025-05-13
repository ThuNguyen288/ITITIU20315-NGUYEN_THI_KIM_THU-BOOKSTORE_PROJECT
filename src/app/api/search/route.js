import db from "../dbConect";
import { fetchFromGoogleBooks } from "../fetchFromGoogleBooks";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const attributes = searchParams.get("attribute")?.split(" and ").map((attr) => attr.trim()) || [];

    if (attributes.length === 0) {
      return new Response(JSON.stringify({ error: "No search criteria provided." }), { status: 400 });
    }

    const conditions = [];
    const params = [];

    attributes.forEach((attr) => {
      const condition = `
        (
          p.Name LIKE ?
          OR p.Description LIKE ?
          OR p.PublishYear LIKE ?
          OR p.Author LIKE ?
          OR p.InkColor LIKE ?
          OR p.PenType LIKE ?
          OR t.Name LIKE ?
        )
      `;
      conditions.push(condition);
      params.push(`%${attr}%`, `%${attr}%`, `%${attr}%`, `%${attr}%`, `%${attr}%`, `%${attr}%`, `%${attr}%`);
    });

    const sql = `
      SELECT DISTINCT 
        p.*, 
        pi.ImageURL AS image 
      FROM products p
      LEFT JOIN productimages pi ON p.ProductID = pi.ProductID AND pi.IsPrimary = 1
      LEFT JOIN tags t ON p.TagID = t.TagID
      ${conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : ""}
      ORDER BY p.Name ASC
      LIMIT 10
    `;

    const [products] = await db.execute(sql, params);

    if (products.length > 0) {
      return new Response(JSON.stringify({ source: "local", products }), { status: 200 });
    }

    // Không tìm thấy trong DB → gọi Google Books API
    const googleResults = await fetchFromGoogleBooks(attributes);
    console.log(googleResults)

    return new Response(JSON.stringify({ source: "google", products: googleResults }), { status: 200 });
  } catch (err) {
    console.error("Error searching products:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  } finally {
  }
}
