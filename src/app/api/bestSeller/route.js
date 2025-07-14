import db from "../dbConect";
import { startOfWeek, endOfWeek, format } from "date-fns";

export async function GET(req) {
  try {
    const today = new Date();

    // Lấy từ thứ 2 đến Chủ nhật của tuần hiện tại
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

    const weekStartStr = format(weekStart, "yyyy-MM-dd");
    const weekEndStr = format(weekEnd, "yyyy-MM-dd");

    // Lấy top sản phẩm tuần này
    const [weeklyProducts] = await db.execute(`
      SELECT 
        p.ProductID,
        ANY_VALUE(p.Name) AS Name,
        ANY_VALUE(p.Price) AS Price,
        ANY_VALUE(p.Author) AS Author,
        ANY_VALUE(p.Description) AS Description,
        ANY_VALUE(pi.ImageURL) AS image,
        ANY_VALUE(p.Rating) AS Rating,
        ANY_VALUE(p.RatingCount) AS RatingCount,
        SUM(r.Quantity) AS TotalSoldThisWeek
      FROM revenue r
      JOIN products p ON r.ProductID = p.ProductID
      LEFT JOIN productimages pi ON pi.ProductID = p.ProductID AND pi.IsPrimary = 1
      WHERE r.Sale_date BETWEEN ? AND ?
      GROUP BY r.ProductID
      ORDER BY TotalSoldThisWeek DESC
      LIMIT 4
    `, [weekStartStr, weekEndStr]);

    if (weeklyProducts.length >= 4) {
      return new Response(JSON.stringify({ products: weeklyProducts }), { status: 200 });
    }

    const excludedIDs = weeklyProducts.map(item => item.ProductID);
    const remainingCount = 4 - weeklyProducts.length;

    let fulltimeProducts = [];

    if (excludedIDs.length > 0) {
      const placeholders = excludedIDs.map(() => '?').join(',');
      const limitValue = remainingCount; // Gán giá trị LIMIT cụ thể

      const [result] = await db.execute(`
        SELECT 
          p.ProductID,
          ANY_VALUE(p.Name) AS Name,
          ANY_VALUE(p.Price) AS Price,
          ANY_VALUE(p.Author) AS Author,
          ANY_VALUE(p.Description) AS Description,
          ANY_VALUE(p.Rating) AS Rating,
          ANY_VALUE(p.RatingCount) AS RatingCount,
          ANY_VALUE(pi.ImageURL) AS image,
          SUM(r.Quantity) AS TotalSoldAllTime
        FROM revenue r
        JOIN products p ON r.ProductID = p.ProductID
        LEFT JOIN productimages pi ON pi.ProductID = p.ProductID AND pi.IsPrimary = 1
        WHERE p.ProductID NOT IN (${placeholders})
        GROUP BY r.ProductID
        ORDER BY TotalSoldAllTime DESC
        LIMIT ${limitValue} -- Gắn trực tiếp vào query
      `, [...excludedIDs]);
      fulltimeProducts = result;

    } else {
      const limitValue = remainingCount; // Gán giá trị LIMIT cụ thể

      // Trường hợp chưa bán được gì tuần này → không cần NOT IN
      const [result] = await db.execute(`
        SELECT 
          p.ProductID,
          ANY_VALUE(p.Name) AS Name,
          ANY_VALUE(p.Price) AS Price,
          ANY_VALUE(p.Author) AS Author,
          ANY_VALUE(p.Description) AS Description,
          ANY_VALUE(pi.ImageURL) AS image,
          ANY_VALUE(p.Rating) AS Rating,
          ANY_VALUE(p.RatingCount) AS RatingCount,
          SUM(r.Quantity) AS TotalSoldAllTime
        FROM revenue r
        JOIN products p ON r.ProductID = p.ProductID
        LEFT JOIN productimages pi ON pi.ProductID = p.ProductID AND pi.IsPrimary = 1
        GROUP BY r.ProductID
        ORDER BY TotalSoldAllTime DESC
        LIMIT ${limitValue} -- Gắn trực tiếp vào query
      `);
      fulltimeProducts = result;
    }

    const finalProducts = [...weeklyProducts, ...fulltimeProducts];

    return new Response(JSON.stringify({ products: finalProducts }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error("Error fetching best sellers:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
