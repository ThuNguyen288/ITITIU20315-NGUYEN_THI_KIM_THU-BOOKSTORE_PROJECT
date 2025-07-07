import { startOfWeek, endOfWeek, format } from "date-fns";
import db from "../../../dbConect";

export async function GET(req) {
  try {
    // Tính ngày đầu và cuối tuần hiện tại (Thứ 2 - Chủ nhật)
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Thứ 2
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });     // Chủ nhật

    const weekStartStr = format(weekStart, "yyyy-MM-dd");
    const weekEndStr = format(weekEnd, "yyyy-MM-dd");

    // B1: Lấy danh sách sản phẩm bán ra trong tuần từ bảng revenue
    const [revenues] = await db.execute(`
      SELECT ProductID, SUM(Quantity) AS TotalSold
      FROM revenue
      WHERE Sale_date >= ? AND Sale_date <= ?
      GROUP BY ProductID
    `, [weekStartStr, weekEndStr]);

    if (revenues.length === 0) {
      return new Response(JSON.stringify({ chartData: [] }), { status: 200 });
    }

    // B2: Lấy ProductID -> TagID từ bảng products
    const productIds = revenues.map(r => r.ProductID);
    const placeholders = productIds.map(() => "?").join(",");
    const [products] = await db.execute(
      `SELECT ProductID, TagID FROM products WHERE ProductID IN (${placeholders})`,
      productIds
    );

    // B3: Gộp dữ liệu Sold + TagID
    const tagSoldMap = {};

    for (const revenue of revenues) {
      const product = products.find(p => p.ProductID === revenue.ProductID);
      if (!product || !product.TagID) continue;

      const tagIds = product.TagID.split(",").map(id => id.trim());

      for (const tagId of tagIds) {
        if (!tagSoldMap[tagId]) tagSoldMap[tagId] = 0;
        tagSoldMap[tagId] += revenue.TotalSold;
      }
    }

    // B4: Lấy tên tag từ bảng tags
    const tagIds = Object.keys(tagSoldMap);
    const tagPlaceholders = tagIds.map(() => "?").join(",");
    const [tags] = await db.execute(
      `SELECT TagID, Name FROM tags WHERE TagID IN (${tagPlaceholders})`,
      tagIds
    );

    // B5: Trả về dữ liệu đã gắn tên
    const chartData = tags.map(tag => ({
      tag: tag.Name,
      totalSold: tagSoldMap[tag.TagID] || 0
    }));

    return new Response(JSON.stringify({ chartData }), { status: 200 });

  } catch (err) {
    console.error("Error generating tag-based weekly sales:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
