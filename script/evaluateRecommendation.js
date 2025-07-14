import db from "@/app/api/dbConect";

export async function evaluateMetrics(k = 4) {
  try {
    const [users] = await db.execute(`SELECT DISTINCT CustomerID FROM recommended_logs`);
    if (!users || users.length === 0) {
      return {
        PrecisionAtK: "0.000",
        RecallAtK: "0.000",
        UsersEvaluated: 0,
        ActionStats: [],
        message: "No user data available",
      };
    }

    let totalPrecision = 0;
    let totalRecall = 0;
    let count = 0;

    for (const { CustomerID } of users) {
      const [recommended] = await db.execute(
        `SELECT ProductID FROM recommended_logs WHERE CustomerID = ? ORDER BY RankPosition ASC LIMIT ${Number(k)}`,
        [CustomerID]
      );

      const [groundTruth] = await db.execute(
        `SELECT DISTINCT ProductID FROM ground_truth_logs WHERE CustomerID = ?`,
        [CustomerID]
      );

      const recommendedSet = new Set(recommended.map(r => r.ProductID));
      const truthSet = new Set(groundTruth.map(g => g.ProductID));

      const intersection = [...recommendedSet].filter(id => truthSet.has(id));
      const precision = intersection.length / k;
      const recall = truthSet.size > 0 ? intersection.length / truthSet.size : 0;

      totalPrecision += precision;
      totalRecall += recall;
      count++;
    }

    // 📊 Thêm phần này để tổng hợp hành vi theo ActionType
    const [actionStats] = await db.execute(`
      SELECT ActionType, COUNT(*) as Total
      FROM ground_truth_logs
      GROUP BY ActionType
    `);

    // Sau khi vòng for tính xong Precision/Recall...
    return {
      PrecisionAtK: count ? (totalPrecision / count).toFixed(3) : "0.000",
      RecallAtK: count ? (totalRecall / count).toFixed(3) : "0.000",
      UsersEvaluated: count,
      TotalCorrectRecommendations: Math.round(totalPrecision * k), // tổng số sản phẩm gợi ý đúng
      ActionStats: actionStats, // [{ ActionType, Total }]
    };

  } catch (err) {
    console.error("Error in evaluateMetrics:", err);
    throw err;
  }
}
