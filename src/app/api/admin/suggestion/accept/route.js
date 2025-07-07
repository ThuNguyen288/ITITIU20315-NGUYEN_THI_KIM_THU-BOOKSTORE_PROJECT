import db from "@/app/api/dbConect";

export async function POST(req) {
  try {
    const { productId, suggestionType } = await req.json();

    if (!productId || !suggestionType) {
      return Response.json({ error: "Missing productId or suggestionType" }, { status: 400 });
    }

    if (suggestionType === "DECREASE") {
      // Giảm giá: tăng discount thêm 10%
      await db.execute(`
        UPDATE Products
        SET discount = COALESCE(discount, 0) + 10
        WHERE ProductID = ?
      `, [productId]);
    } else if (suggestionType === "INCREASE") {
      // Tăng giá: reset discount về 0
      await db.execute(`
        UPDATE Products
        SET discount = 0
        WHERE ProductID = ?
      `, [productId]);
    } else {
      return Response.json({ error: "Invalid suggestionType" }, { status: 400 });
    }

    // Xóa sản phẩm khỏi bảng price_suggestions
    await db.execute(`
      DELETE FROM price_suggestions
      WHERE ProductID = ?
    `, [productId]);

    return Response.json({ message: "Suggestion applied successfully" });
  } catch (error) {
    console.error("Error applying suggestion:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
