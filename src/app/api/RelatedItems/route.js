import db from "../dbConect";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get("productId");

    if (!productId) {
      return new Response(JSON.stringify({ error: "ProductID is required" }), { status: 400 });
    }

    // Lấy thông tin sản phẩm hiện tại: TagID và CategoryID
    const [product] = await db.execute(
      "SELECT TagID, CategoryID FROM products WHERE ProductID = ?",
      [productId]
    );

    if (product.length === 0) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }

    const { TagID, CategoryID } = product[0];

    let relatedProducts = [];

    if (CategoryID === 2 || CategoryID === 3) {
      // Nếu CategoryID = 2 hoặc 3 -> gợi ý sản phẩm cùng CategoryID
      const [productsByCategory] = await db.execute(
        `SELECT p.*, pi.ImageURL AS image
         FROM products p
         LEFT JOIN productimages pi ON p.ProductID = pi.ProductID AND pi.IsPrimary = 1
         WHERE p.CategoryID = ? AND p.ProductID != ?
         LIMIT 4`,
        [CategoryID, productId]
      );

      relatedProducts = productsByCategory;
    } else if (CategoryID === 1) {
      // Nếu CategoryID = 1 -> giữ nguyên logic cũ (dựa theo TagID)
      const tagIds = TagID.split(","); // Tách các TagID

      if (tagIds.length > 0) {
        const [productIds] = await db.execute(
          `SELECT DISTINCT ProductID FROM products 
           WHERE FIND_IN_SET(TagID, ?) AND ProductID != ?`,
          [tagIds.join(","), productId]
        );

        if (productIds.length > 0) {
          const relatedProductIds = productIds.map(p => p.ProductID);
          const productPlaceholders = relatedProductIds.map(() => "?").join(",");

          const [productsByTag] = await db.execute(
            `SELECT p.*, pi.ImageURL AS image
             FROM products p
             LEFT JOIN productimages pi ON p.ProductID = pi.ProductID AND pi.IsPrimary = 1
             WHERE p.ProductID IN (${productPlaceholders})
             LIMIT 4`,
            relatedProductIds
          );

          relatedProducts = productsByTag;
        }
      }
    }

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
