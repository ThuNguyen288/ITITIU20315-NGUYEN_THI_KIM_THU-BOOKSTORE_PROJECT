import db from "./dbConect";

export async function increaseTagScore(CustomerID, ProductID, score) {
  const [rows] = await db.execute(`SELECT TagID FROM products WHERE ProductID = ?`, [ProductID]);
  if (!rows.length || !rows[0].TagID) return;

  const tagIds = rows[0].TagID
    .split(',')
    .map(id => parseInt(id.trim()))
    .filter(id => !isNaN(id));

  for (const tagId of tagIds) {
    const [[exists]] = await db.execute(
      'SELECT 1 FROM tags WHERE TagID = ?',
      [tagId]
    );

    if (!exists) {
      console.warn(`TagID ${tagId} not found in tags. Skipped.`);
      continue;
    }

    await db.execute(`
      INSERT INTO customer_tag_scores (CustomerID, TagID, Score)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE Score = Score + ?
    `, [CustomerID, tagId, score, score]);
  }
}
