import db from "../dbConect";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get("productId");

    if (!productId) {
      return new Response(JSON.stringify({ error: "ProductID is required" }), { status: 400 });
    }

    // Lấy danh sách TagID của sản phẩm hiện tại
    const [tags] = await db.execute(
      "SELECT TagID FROM product_tag WHERE ProductID = ?",
      [productId]
    );

    if (tags.length === 0) {
      return new Response(JSON.stringify({ products: [] }), { status: 200 });
    }

    const tagIds = tags.map(tag => tag.TagID);
    const placeholders = tagIds.map(() => "?").join(",");
    
    // Lấy danh sách ProductID có các TagID vừa lấy
    const [productIds] = await db.execute(
      `SELECT DISTINCT ProductID FROM product_tag WHERE TagID IN (${placeholders}) AND ProductID != ?`,
      [...tagIds, productId]
    );

    if (productIds.length === 0) {
      return new Response(JSON.stringify({ products: [] }), { status: 200 });
    }

    const relatedProductIds = productIds.map(p => p.ProductID);
    const productPlaceholders = relatedProductIds.map(() => "?").join(",");

    // Lấy thông tin sản phẩm từ bảng products
    const [relatedProducts] = await db.execute(
      `SELECT p.*, ANY_VALUE(pi.ImageURL) AS image, COUNT(pt.TagID) AS tag_match_count 
       FROM products p
       LEFT JOIN product_tag pt ON p.ProductID = pt.ProductID AND pt.TagID IN (${placeholders})
       LEFT JOIN productimages pi ON p.ProductID = pi.ProductID AND pi.IsPrimary = 1
       WHERE p.ProductID IN (${productPlaceholders})
       GROUP BY p.ProductID
       ORDER BY tag_match_count DESC
       LIMIT 8`,
      [...tagIds, ...relatedProductIds]
    );

    return new Response(
      JSON.stringify({ products: relatedProducts }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching related products:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
