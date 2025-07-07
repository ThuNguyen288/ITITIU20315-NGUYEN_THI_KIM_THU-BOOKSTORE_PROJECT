import db from "../../../dbConect";
import { startOfWeek, endOfWeek, format } from "date-fns";

// GET method: Lấy 4 sản phẩm bán chạy nhất trong tuần (Thứ 2 -> Chủ nhật tuần hiện tại)
export async function GET(req) {
  try {
    const today = new Date();

    // Lấy ngày bắt đầu (thứ 2) và kết thúc (chủ nhật) của tuần hiện tại
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Thứ 2
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });     // Chủ nhật

    // Chuyển về dạng yyyy-MM-dd để so sánh SQL
    const weekStartStr = format(weekStart, "yyyy-MM-dd");
    const weekEndStr = format(weekEnd, "yyyy-MM-dd");

    const [products] = await db.execute(`
      SELECT 
        p.ProductID,
        ANY_VALUE(p.Name) AS Name,
        ANY_VALUE(p.Price) AS Price,
        ANY_VALUE(p.Author) AS Author,
        ANY_VALUE(p.Description) AS Description,
        ANY_VALUE(pi.ImageURL) AS image,
        SUM(r.Quantity) AS TotalSoldThisWeek
      FROM revenue r
      JOIN products p ON r.ProductID = p.ProductID
      LEFT JOIN productimages pi ON pi.ProductID = p.ProductID AND pi.IsPrimary = 1
      WHERE r.Sale_date BETWEEN ? AND ?
      GROUP BY r.ProductID
      ORDER BY TotalSoldThisWeek DESC
      LIMIT 4
    `, [weekStartStr, weekEndStr]);

    return new Response(JSON.stringify({ products }), { status: 200 });
  } catch (err) {
    console.error("Error fetching best sellers of the week:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
