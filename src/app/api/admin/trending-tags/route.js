// /api/admin/trending-tags/route.ts
import db from "@/app/api/dbConect";

export async function GET() {
  try {
    const [tags] = await db.execute(`
      SELECT 
        t.TagID, t.Name, SUM(cts.Score) AS TotalScore
      FROM customer_tag_scores cts
      JOIN tags t ON t.TagID = cts.TagID
      GROUP BY t.TagID
      ORDER BY TotalScore DESC
    `);

    return Response.json({ tags });
  } catch (err) {
    console.error("Failed to fetch trending tags:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
