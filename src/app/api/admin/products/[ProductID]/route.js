import db from "../../../dbConect";

// DELETE method to remove a product (set status = inactive)
export async function DELETE(req, { params }) {
  try {
    const { ProductID } = params;

    if (!ProductID) {
      return new Response(
        JSON.stringify({ error: "Product ID is required" }),
        { status: 400 }
      );
    }

    const [result] = await db.execute(
      "UPDATE products SET status = 'inactive' WHERE ProductID = ?",
      [ProductID]
    );

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ error: "Product not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Product deleted (set inactive) successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting product:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: err.message }),
      { status: 500 }
    );
  }
}

// PUT method to update product details (dynamic fields)
export async function PUT(req, { params }) {
  try {
    const { ProductID } = await params;
    const body = await req.json();

    if (!ProductID) {
      return new Response(JSON.stringify({ error: "ProductID is required" }), { status: 400 });
    }

    // Build query dynamic depending on which fields are sent
    const fields = [];
    const values = [];

    if ('Name' in body) {
      fields.push("Name = ?");
      values.push(body.Name);
    }
    if ('OriginalPrice' in body) {
      fields.push("OriginalPrice = ?");
      values.push(body.OriginalPrice);
    }
    if ('Stock' in body) {
      fields.push("Stock = ?");
      values.push(body.Stock);
    }
    if ('discount' in body) {
      fields.push("discount = ?");
      values.push(body.discount);
    }

    if (fields.length === 0) {
      return new Response(JSON.stringify({ error: "No valid fields to update" }), { status: 400 });
    }

    const query = `UPDATE products SET ${fields.join(", ")} WHERE ProductID = ?`;
    values.push(ProductID);

    const [result] = await db.execute(query, values);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }

    // Check stock for zero → create notification if out of stock
    if ('Stock' in body && body.Stock === 0) {
      const [productInfo] = await db.execute(
        "SELECT Name FROM products WHERE ProductID = ?",
        [ProductID]
      );
      const productName = productInfo[0]?.Name || 'Unknown product';

      await db.execute(`
        INSERT INTO notifications (ProductID, Message, CreatedAt, Status)
        VALUES (?, ?, NOW(), 'Unread')
      `, [ProductID, `Sản phẩm ${productName} (ID: ${ProductID}) đã hết hàng`]);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Product updated successfully" }),
      { status: 200 }
    );

  } catch (err) {
    console.error("Error updating product:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: err.message }),
      { status: 500 }
    );
  }
}
