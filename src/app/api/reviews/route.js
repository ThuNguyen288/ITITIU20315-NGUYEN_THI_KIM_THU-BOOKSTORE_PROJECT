import db from "../dbConect";

// GET: Lấy danh sách đánh giá theo ProductID và Rating trung bình từ bảng products
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('ProductID');

  if (!productId) {
    return new Response(JSON.stringify({ error: 'ProductID is required' }), { status: 400 });
  }

  try {
    // Lấy Rating trung bình từ bảng products
    const [productRating] = await db.execute(`
      SELECT Rating, RatingCount
      FROM products
      WHERE ProductID = ?
    `, [productId]);

    // Nếu không tìm thấy sản phẩm, trả về lỗi
    if (productRating.length === 0) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }

    const overallRating = productRating[0].Rating;
    const RatingCount = productRating[0].RatingCount;


    // Lấy danh sách đánh giá từ bảng reviews
    const [reviews] = await db.execute(`
      SELECT 
        r.ReviewID,
        r.Rating,
        r.Comment,
        r.ReviewDate,
        c.Name AS CustomerName
      FROM reviews r
      LEFT JOIN customers c ON r.CustomerID = c.CustomerID
      WHERE r.ProductID = ?
      ORDER BY r.ReviewDate DESC
      LIMIT 10
    `, [productId]);

    return new Response(JSON.stringify({ reviews, overallRating, RatingCount }), { status: 200 });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}


// POST: Thêm đánh giá mới nếu chưa đánh giá
export async function POST(req) {
  try {
    const { ProductID, CustomerID, Rating, Comment, OrderID } = await req.json();

    if (!ProductID || !CustomerID || !Rating) {
      return new Response(
        JSON.stringify({ error: 'ProductID, CustomerID, and Rating are required' }),
        { status: 400 }
      );
    }

    // 🔒 Kiểm tra người dùng đã đánh giá sản phẩm này chưa
    const [existing] = await db.execute(
      `SELECT ReviewID FROM reviews WHERE ProductID = ? AND CustomerID = ? AND OrderID = ?`,
      [ProductID, CustomerID, OrderID]
    );

    if (existing.length > 0) {
      return new Response(
        JSON.stringify({ error: 'You have already reviewed this product' }),
        { status: 400 }
      );
    }

    // ✅ Nếu chưa thì insert đánh giá mới vào bảng reviews
    const [result] = await db.execute(`
      INSERT INTO reviews (ProductID, CustomerID, Rating, Comment, ReviewDate, OrderID)
      VALUES (?, ?, ?, ?, NOW(), ?)
    `, [ProductID, CustomerID, Rating, Comment, OrderID]);

    // 🧮 Tính toán lại rating trung bình của sản phẩm
    const [reviews] = await db.execute(`
      SELECT AVG(Rating) AS averageRating, COUNT(*) AS ratingCount FROM reviews WHERE ProductID = ?
    `, [ProductID]);

    const averageRating = reviews[0].averageRating || 0;
    const ratingCount = reviews[0].ratingCount;

    // ✅ Cập nhật lại rating trung bình và số lượng đánh giá vào bảng products
    await db.execute(`
      UPDATE products 
      SET Rating = ?, RatingCount = ? 
      WHERE ProductID = ?
    `, [averageRating, ratingCount, ProductID]);

    return new Response(
      JSON.stringify({ message: 'Review added successfully', ReviewID: result.insertId }),
      { status: 201 }
    );

  } catch (err) {
    console.error("Error adding review:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

  