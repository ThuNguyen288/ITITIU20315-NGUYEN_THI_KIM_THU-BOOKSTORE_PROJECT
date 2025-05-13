import db from "../dbConect";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const CustomerID = searchParams.get("CustomerID");

  if (!CustomerID) {
    return new Response(JSON.stringify({ error: "Missing CustomerID" }), { status: 400 });
  }

  try {
    const [products] = await db.execute(`
      SELECT 
          ANY_VALUE(p.ProductID) AS ProductID,
          ANY_VALUE(p.Name) AS Name,
          ANY_VALUE(p.Price) AS Price,
          ANY_VALUE(p.Stock) AS Stock,
          ANY_VALUE(p.Clicked) AS Clicked,
          ANY_VALUE(p.CategoryID) AS CategoryID,
          ANY_VALUE(p.Rating) AS Rating,
          ANY_VALUE(p.RatingCount) AS RatingCount,
          ANY_VALUE(pi.ImageURL) AS image,
          SUM(cts.Score) AS TotalScore
      FROM customer_tag_scores cts
      JOIN products p ON 
          FIND_IN_SET(cts.TagID, p.TagID)
      LEFT JOIN productimages pi ON p.ProductID = pi.ProductID AND pi.IsPrimary = 1
      WHERE cts.CustomerID = ?
      GROUP BY p.ProductID
      ORDER BY TotalScore DESC
      LIMIT 4;
    `, [CustomerID]);

    return new Response(JSON.stringify({ products }), { status: 200 });
  } catch (err) {
    console.error("Error fetching recommended products:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
