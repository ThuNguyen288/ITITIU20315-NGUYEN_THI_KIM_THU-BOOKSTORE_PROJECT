import db from "../dbConect";

// GET method: Tìm kiếm nâng cao trong nhiều bảng và cột, chỉ sử dụng attribute
export async function GET(req) {
  try {
    // Lấy query string từ URL
    const { searchParams } = new URL(req.url);
    const attributes = searchParams.get("attribute")?.split(" and ").map((attr) => attr.trim()) || [];

    // Nếu không có attribute, trả về lỗi
    if (attributes.length === 0) {
      return new Response(
        JSON.stringify({ error: "No search criteria provided." }),
        { status: 400 }
      );
    }

    // Khởi tạo điều kiện WHERE động
    const conditions = [];
    const params = [];

    // Tìm kiếm các attribute trong tất cả các bảng và cột liên quan
    attributes.forEach((attr) => {
      const condition = `
        (
          p.Name LIKE ?
          OR p.Description LIKE ?
          OR b.PublishYear LIKE ?
          OR b.Author LIKE ?
          OR pe.InkColor LIKE ?
          OR pe.PenType LIKE ?
          OR t.Name LIKE ?
        )
      `;
      conditions.push(condition);
      params.push(
        `%${attr}%`, `%${attr}%`, 
        `%${attr}%`, `%${attr}%`, 
        `%${attr}%`, `%${attr}%`, 
        `%${attr}%`
      );
    });

    // Tạo câu truy vấn SQL với các điều kiện tìm kiếm
    const sql = `
      SELECT DISTINCT 
        p.*,
        pi.ImageURL AS image 
      FROM products p
      LEFT JOIN productimages pi 
        ON p.ProductID = pi.ProductID AND pi.IsPrimary = 1
      LEFT JOIN books b 
        ON p.ProductID = b.ProductID
      LEFT JOIN pens pe 
        ON p.ProductID = pe.ProductID
      LEFT JOIN product_tag pt 
        ON p.ProductID = pt.ProductID
      LEFT JOIN tags t 
        ON pt.TagID = t.TagID
      ${conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : ""}
      ORDER BY p.Name ASC
      LIMIT 10
    `;

    // Thực thi truy vấn
    const [products] = await db.execute(sql, params);

    return new Response(
      JSON.stringify({ products }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error searching products:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
  db.release();
}
