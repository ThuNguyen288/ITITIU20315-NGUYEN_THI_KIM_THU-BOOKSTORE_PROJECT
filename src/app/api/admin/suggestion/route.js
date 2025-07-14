import db from "../../dbConect";
import { format } from "date-fns";

export async function POST() {
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
        p.CategoryID,
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

    // Lấy Top-N theo CategoryID dựa trên customer_tag_scores
    const [topCategoryRaw] = await db.execute(`
      SELECT 
        p.CategoryID,
        p.ProductID,
        SUM(cts.Score) AS TotalScore
      FROM customer_tag_scores cts
      JOIN products p ON FIND_IN_SET(cts.TagID, p.TagID)
      GROUP BY p.CategoryID, p.ProductID
      ORDER BY p.CategoryID, TotalScore DESC
    `);

    const topCategoryMap = new Map();
    for (const item of topCategoryRaw) {
      const list = topCategoryMap.get(item.CategoryID) || [];
      if (list.length < 3) {
        list.push(item.ProductID);
        topCategoryMap.set(item.CategoryID, list);
      }
    }

    let suggestionCandidates = [];

    for (const row of revenues) {
      const { ProductID, CategoryID, Price, OriginalPrice, Clicked, QtyThisWeek, QtyLastWeek, Qty2WeeksAgo, RevenueThisWeek, RevenueLastWeek, Revenue2WeeksAgo, discount } = row;
      const conversionRate = Clicked > 0 ? QtyThisWeek / Clicked : 0;
      const isTopCategory = topCategoryMap.get(CategoryID)?.includes(ProductID);

      let suggestionType = null;
      let reason = "";
      let suggestedPrice = parseFloat(Price);
      let importanceScore = isTopCategory ? 1000 : 0;

      if (
        Clicked >= 20 &&
        conversionRate < 0.05 &&
        RevenueThisWeek < RevenueLastWeek &&
        RevenueLastWeek < Revenue2WeeksAgo
      ) {
        suggestionType = "DECREASE";
        reason = "High clicks but low conversion, revenue decreasing. Consider increasing discount.";
      } else if (
        discount > 0 &&
        Price < OriginalPrice &&
        RevenueThisWeek > RevenueLastWeek &&
        RevenueLastWeek > Revenue2WeeksAgo
      ) {
        suggestionType = "INCREASE";
        reason = "Currently discounted, revenue rising. Consider removing discount.";
      }

      if (suggestionType) {
        suggestionCandidates.push({
          ProductID,
          OldPrice: Price,
          SuggestedPrice: suggestedPrice,
          SuggestionType: suggestionType,
          Reason: reason,
          importanceScore
        });
      }
    }

    // Backup nếu chưa đủ 4
    const needed = Math.max(4 - suggestionCandidates.length, 0);
    if (needed > 0) {
      const excludedIds = suggestionCandidates.map(s => s.ProductID);
      const placeholders = excludedIds.map(() => '?').join(', ');

      let [backup] = excludedIds.length
        ? await db.execute(`
            SELECT ProductID, Price, Sold
            FROM products
            WHERE ProductID NOT IN (${placeholders})
            ORDER BY Sold ASC
            LIMIT ${needed}
          `, excludedIds)
        : await db.execute(`
            SELECT ProductID, Price, Sold
            FROM products
            ORDER BY Sold ASC
            LIMIT ${needed}
          `);

      for (const row of backup) {
        suggestionCandidates.push({
          ProductID: row.ProductID,
          OldPrice: row.Price,
          SuggestedPrice: row.Price,
          SuggestionType: "NO_CHANGE",
          Reason: "Low sales product - consider review",
          importanceScore: 0
        });
      }
    }

    for (const s of suggestionCandidates) {
      const [exists] = await db.execute(`
        SELECT COUNT(*) as count FROM price_suggestions WHERE ProductID = ?
      `, [s.ProductID]);

      if (exists[0].count === 0) {
        await db.execute(`
          INSERT INTO price_suggestions
          (ProductID, OldPrice, SuggestedPrice, SuggestionType, Reason, CreatedAt)
          VALUES (?, ?, ?, ?, ?, NOW())
        `, [s.ProductID, s.OldPrice, s.SuggestedPrice, s.SuggestionType, s.Reason]);
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

