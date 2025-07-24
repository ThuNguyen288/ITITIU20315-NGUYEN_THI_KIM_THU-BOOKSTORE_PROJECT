import { startOfWeek, endOfWeek, format } from "date-fns";
import db from "../../../dbConect";

export async function GET(req) {
  try {
    // B1: Tính ngày bắt đầu và kết thúc của tuần hiện tại (Thứ 2 - Chủ nhật)
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Thứ 2
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });     // Chủ nhật

    const weekStartStr = format(weekStart, "yyyy-MM-dd");
    const weekEndStr = format(weekEnd, "yyyy-MM-dd");

    // B2: Lấy số lượng bán ra của từng sản phẩm trong tuần
    const [revenues] = await db.execute(`
      SELECT ProductID, SUM(Quantity) AS TotalSold
      FROM revenue
      WHERE Sale_date BETWEEN ? AND ?
      GROUP BY ProductID
    `, [weekStartStr, weekEndStr]);

    if (revenues.length === 0) {
      return new Response(JSON.stringify({ chartData: [] }), { status: 200 });
    }

    // B3: Lấy TagID tương ứng từ bảng products
    const productIds = revenues.map(r => r.ProductID);
    const placeholders = productIds.map(() => "?").join(",");
    const [products] = await db.execute(
      `SELECT ProductID, TagID FROM products WHERE ProductID IN (${placeholders})`,
      productIds
    );

    // B4: Gộp dữ liệu: TagID => Tổng Sold
    const tagSoldMap = {};

    for (const revenue of revenues) {
      const product = products.find(p => p.ProductID === revenue.ProductID);
      if (!product || !product.TagID) continue;

      const tagIds = product.TagID
        .split(",")
        .map(id => id.trim())
        .filter(id => id); // Loại bỏ tag rỗng

      const uniqueTagIds = [...new Set(tagIds)];

      for (const tagId of uniqueTagIds) {
        if (!tagSoldMap[tagId]) tagSoldMap[tagId] = 0;
        tagSoldMap[tagId] += Number(revenue.TotalSold);
      }
    }

    if (Object.keys(tagSoldMap).length === 0) {
      return new Response(JSON.stringify({ chartData: [] }), { status: 200 });
    }

    // B5: Lấy tên Tag từ bảng tags
    const tagIds = Object.keys(tagSoldMap);
    const tagPlaceholders = tagIds.map(() => "?").join(",");
    const [tags] = await db.execute(
      `SELECT TagID, Name FROM tags WHERE TagID IN (${tagPlaceholders})`,
      tagIds
    );

    // B6: Gộp dữ liệu cuối cùng
    const chartData = tags.map(tag => ({
      tag: tag.Name,
      totalSold: tagSoldMap[tag.TagID] || 0,
    })).sort((a, b) => b.totalSold - a.totalSold); // Sắp xếp giảm dần

    return new Response(JSON.stringify({ chartData }), { status: 200 });

  } catch (err) {
    console.error("Error generating tag-based weekly sales:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
