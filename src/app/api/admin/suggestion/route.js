import db from "../../dbConect";
import { format } from "date-fns";

export async function POST(req) {
  try {
    // Lấy ngày hôm nay và 7 ngày trước
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    const thisWeekStr = format(today, "yyyy-MM-dd");
    const lastWeekStr = format(lastWeek, "yyyy-MM-dd");

    // Lấy dữ liệu doanh thu của tuần này và tuần trước theo sản phẩm
    const [revenues] = await db.execute(`
      SELECT r.ProductID,
        SUM(CASE WHEN r.Sale_date >= ? THEN r.Quantity ELSE 0 END) AS QtyThisWeek,
        SUM(CASE WHEN r.Sale_date < ? THEN r.Quantity ELSE 0 END) AS QtyLastWeek,
        SUM(CASE WHEN r.Sale_date >= ? THEN r.Total ELSE 0 END) AS RevenueThisWeek,
        SUM(CASE WHEN r.Sale_date < ? THEN r.Total ELSE 0 END) AS RevenueLastWeek
      FROM revenue r
      GROUP BY r.ProductID
    `, [lastWeekStr, lastWeekStr, lastWeekStr, lastWeekStr]);

    let suggestions = [];

    for (const row of revenues) {
      const [productData] = await db.execute("SELECT Price, Clicked FROM products WHERE ProductID = ?", [row.ProductID]);
      if (productData.length === 0) continue;

      const { Price, Clicked } = productData[0];
      if (Clicked === 0) continue;

      const conversionRate = row.QtyThisWeek / Clicked;
      const revenueDiff = row.RevenueThisWeek - row.RevenueLastWeek;

      let suggestionType = null;
      let reason = "";
      let suggestedPrice = parseFloat(Price);

      if (conversionRate > 0.2 && revenueDiff > 0) {
        // Tăng giá 10%
        suggestionType = "INCREASE";
        suggestedPrice = parseFloat((Price * 1.1).toFixed(2));
        reason = "High conversion rate and revenue increase";
      } else if (conversionRate < 0.05 && row.RevenueThisWeek < row.RevenueLastWeek) {
        // Giảm giá 10%
        suggestionType = "DECREASE";
        suggestedPrice = parseFloat((Price * 0.9).toFixed(2));
        reason = "Low conversion rate and revenue decrease";
      }

      if (suggestionType) {
        suggestions.push({
          ProductID: row.ProductID,
          OldPrice: Price,
          SuggestedPrice: suggestedPrice,
          SuggestionType: suggestionType,
          Reason: reason
        });

        await db.execute(`
          INSERT INTO price_suggestions (ProductID, OldPrice, SuggestedPrice, SuggestionType, Reason, CreatedAt)
          VALUES (?, ?, ?, ?, ?, NOW())
        `, [row.ProductID, Price, suggestedPrice, suggestionType, reason]);
      }
    }

    return new Response(JSON.stringify({ success: true, suggestions }), { status: 200 });
  } catch (err) {
    console.error("Error generating price suggestions:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

export async function GET() {
    try {
      const [results] = await db.execute(`
        SELECT 
          p.ProductID, 
          p.Name, 
          p.Sold, 
          p.Clicked,
          p.Price AS CurrentPrice,
          ps.SuggestedPrice,
          ps.SuggestionType,
          ps.Reason,
          ps.CreatedAt,
          pi.ImageURL AS image
        FROM price_suggestions ps
        JOIN products p ON ps.ProductID = p.ProductID
        LEFT JOIN productimages pi ON pi.ProductID = p.ProductID AND pi.IsPrimary = 1
        ORDER BY ps.CreatedAt DESC
        LIMIT 8
      `);
  
      return new Response(
        JSON.stringify({ products: results }),
        { status: 200 }
      );
    } catch (err) {
      console.error("Error fetching price suggestions:", err);
      return new Response(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500 }
      );
    }
  }
  