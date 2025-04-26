import db from "../dbConect";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get("productId");

    if (!productId) {
      return new Response(JSON.stringify({ error: "ProductID is required" }), { status: 400 });
    }

    // Lấy TagIDs từ cột TagID trong bảng products của sản phẩm hiện tại
    const [product] = await db.execute(
      "SELECT TagID FROM products WHERE ProductID = ?",
      [productId]
    );

    if (product.length === 0) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }

    const tagIds = product[0].TagID.split(","); // Tách các TagID nếu là chuỗi phân cách bằng dấu phẩy
    
    if (tagIds.length === 0) {
      return new Response(JSON.stringify({ products: [] }), { status: 200 });
    }

    // Tạo các placeholder cho truy vấn
    const placeholders = tagIds.map(() => "?").join(",");

    // Lấy danh sách ProductID có các TagID vừa lấy, loại trừ ProductID của sản phẩm hiện tại
    const [productIds] = await db.execute(
      `SELECT DISTINCT ProductID FROM products WHERE FIND_IN_SET(TagID, ?) AND ProductID != ?`,
      [tagIds.join(","), productId]
    );

    if (productIds.length === 0) {
      return new Response(JSON.stringify({ products: [] }), { status: 200 });
    }

    const relatedProductIds = productIds.map(p => p.ProductID);
    const productPlaceholders = relatedProductIds.map(() => "?").join(",");

    // Lấy thông tin sản phẩm từ bảng products
    const [relatedProducts] = await db.execute(
      `SELECT p.*, pi.ImageURL AS image
       FROM products p
       LEFT JOIN productimages pi ON p.ProductID = pi.ProductID AND pi.IsPrimary = 1
       WHERE p.ProductID IN (${productPlaceholders})
       LIMIT 4`,
      relatedProductIds
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
