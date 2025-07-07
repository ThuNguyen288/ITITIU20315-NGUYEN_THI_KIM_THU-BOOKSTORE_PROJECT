import db from "../../dbConect";
import { format } from "date-fns";

export async function POST(req) {
  try {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(today.getDate() - 14);

    const thisWeekStr = format(today, "yyyy-MM-dd");
    const lastWeekStr = format(lastWeek, "yyyy-MM-dd");
    const twoWeeksAgoStr = format(twoWeeksAgo, "yyyy-MM-dd");

    // Lấy dữ liệu revenue 3 tuần gần nhất
    const [revenues] = await db.execute(`
      SELECT 
        r.ProductID,
        p.Price,
        p.OriginalPrice,
        p.Clicked,
        p.discount,
        SUM(CASE WHEN r.Sale_date >= ? THEN r.Quantity ELSE 0 END) AS QtyThisWeek,
        SUM(CASE WHEN r.Sale_date < ? AND r.Sale_date >= ? THEN r.Quantity ELSE 0 END) AS QtyLastWeek,
        SUM(CASE WHEN r.Sale_date < ? THEN r.Quantity ELSE 0 END) AS Qty2WeeksAgo,
        SUM(CASE WHEN r.Sale_date >= ? THEN r.Total ELSE 0 END) AS RevenueThisWeek,
        SUM(CASE WHEN r.Sale_date < ? AND r.Sale_date >= ? THEN r.Total ELSE 0 END) AS RevenueLastWeek,
        SUM(CASE WHEN r.Sale_date < ? THEN r.Total ELSE 0 END) AS Revenue2WeeksAgo
      FROM revenue r
      JOIN products p ON r.ProductID = p.ProductID
      GROUP BY r.ProductID
    `, [lastWeekStr, lastWeekStr, twoWeeksAgoStr, twoWeeksAgoStr, lastWeekStr, lastWeekStr, twoWeeksAgoStr, twoWeeksAgoStr]);

    let suggestionCandidates = [];

    for (const row of revenues) {
      const { ProductID, Price, OriginalPrice, Clicked, QtyThisWeek, QtyLastWeek, Qty2WeeksAgo, RevenueThisWeek, RevenueLastWeek, Revenue2WeeksAgo, discount } = row;

      const conversionRate = Clicked > 0 ? QtyThisWeek / Clicked : 0;

      let suggestionType = null;
      let reason = "";
      let suggestedPrice = parseFloat(Price);

      // Đề xuất giảm giá (DECREASE)
      if (Clicked >= 20 &&
          conversionRate < 0.05 &&
          RevenueThisWeek < RevenueLastWeek &&
          RevenueLastWeek < Revenue2WeeksAgo) {
        suggestionType = "DECREASE";
        suggestedPrice = parseFloat((Price * 0.9).toFixed(2));
        reason = "High clicks but low conversion, revenue decreasing 2 weeks";
      }
      // Đề xuất tăng giá (INCREASE) - reset về giá gốc
      else if (discount !== 0 &&
               Price < OriginalPrice &&
               RevenueThisWeek > RevenueLastWeek &&
               RevenueLastWeek > Revenue2WeeksAgo) {
        suggestionType = "INCREASE";
        suggestedPrice = parseFloat(OriginalPrice);
        reason = "Currently discounted, revenue increasing 2 weeks - suggest reset to original price";
      }

      if (suggestionType) {
        suggestionCandidates.push({
          ProductID,
          OldPrice: Price,
          SuggestedPrice: suggestedPrice,
          SuggestionType: suggestionType,
          Reason: reason,
          importanceScore: 9999
        });
      }
    }

    // Đảm bảo đủ ít nhất 4 gợi ý
    const needed = Math.max(4 - suggestionCandidates.length, 0);

    if (needed > 0) {
      const excludedIds = suggestionCandidates.map(s => s.ProductID);
      let lowSoldProducts = [];

      if (excludedIds.length > 0) {
        const placeholders = excludedIds.map(() => '?').join(', ');

        const [result] = await db.execute(`
          SELECT ProductID, Price, Sold
          FROM products
          WHERE ProductID NOT IN (${placeholders})
          ORDER BY Sold ASC
          LIMIT ${needed}  -- fix LIMIT here
        `, [...excludedIds]);

        lowSoldProducts = result;
      } else {
        const [result] = await db.execute(`
          SELECT ProductID, Price, Sold
          FROM products
          ORDER BY Sold ASC
          LIMIT ${needed}  -- fix LIMIT here
        `);

        lowSoldProducts = result;
      }

      for (const row of lowSoldProducts) {
        suggestionCandidates.push({
          ProductID: row.ProductID,
          OldPrice: row.Price,
          SuggestedPrice: row.Price,
          SuggestionType: "NO_CHANGE",
          Reason: "Low sales product - consider promotion or review",
          importanceScore: 0
        });
      }
    }

    // Kiểm tra trùng ProductID trong bảng price_suggestions
    for (const suggestion of suggestionCandidates) {
      const { ProductID, OldPrice, SuggestedPrice, SuggestionType, Reason } = suggestion;

      const [exists] = await db.execute(`
        SELECT COUNT(*) as count FROM price_suggestions WHERE ProductID = ?
      `, [ProductID]);

      if (exists[0].count === 0) {
        await db.execute(`
          INSERT INTO price_suggestions
            (ProductID, OldPrice, SuggestedPrice, SuggestionType, Reason, CreatedAt)
          VALUES (?, ?, ?, ?, ?, NOW())
        `, [ProductID, OldPrice, SuggestedPrice, SuggestionType, Reason]);
      } else {
        console.log(`ProductID ${ProductID} already exists in price_suggestions. Skipping.`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      totalSuggestions: suggestionCandidates.length,
      suggestions: suggestionCandidates
    }), { status: 200 });

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
      JOIN (
        SELECT ProductID, MAX(CreatedAt) AS Latest
        FROM price_suggestions
        GROUP BY ProductID
      ) latest_ps ON ps.ProductID = latest_ps.ProductID AND ps.CreatedAt = latest_ps.Latest
      JOIN products p ON ps.ProductID = p.ProductID
      LEFT JOIN productimages pi ON pi.ProductID = p.ProductID AND pi.IsPrimary = 1
      ORDER BY 
        FIELD(ps.SuggestionType, 'DECREASE', 'INCREASE', 'NO_CHANGE'),
        ps.CreatedAt DESC
      LIMIT 4
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

