// pages/api/admin/products/[ProductID].js
import db from "../../../dbConect";

// DELETE method to remove a product
export async function DELETE(req, { params }) {
  try {
    const { ProductID } = await params; // Directly access params

    if (!ProductID) {
      return new Response(
        JSON.stringify({ error: "Product ID is required" }),
        { status: 400 }
      );
    }

    console.log(`Deleting product with ID: ${ProductID}`);

    const [result] = await db.execute(
      "DELETE FROM products WHERE ProductID = ?",
      [ProductID]
    );

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ error: "Product not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Product deleted successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting product:", err);

    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: err.message,
      }),
      { status: 500 }
    );
  }
}

// PUT method to update product details
export async function PUT(req, { params }) {
  try {
    const { ProductID } = await params; // Directly access params
    const { Name, Price, Stock } = await req.json();

    if (!ProductID || !Name || !Price || !Stock) {
      return new Response(
        JSON.stringify({ error: "ProductID, Name, Price, and Stock are required" }),
        { status: 400 }
      );
    }

    const [result] = await db.execute(
      "UPDATE products SET Name = ?, Price = ?, Stock = ? WHERE ProductID = ?",
      [Name, Price, Stock, ProductID]
    );
    
    const [product] = await db.execute(
      "SELECT Name, Stock FROM products WHERE ProductID = ?",
      [ProductID]
    );

    if (product.length === 0) {
      return new Response(
        JSON.stringify({ error: `Product with ID ${ProductID} not found after update` }),
        { status: 404 }
      );
    }

    const { Name: productName, Stock: productStock } = product[0];

    // Nếu hết hàng, tạo thông báo
    if (productStock === 0) {
      await db.execute(
        `
        INSERT INTO notifications (ProductID, Message, CreatedAt, Status)
        VALUES (?, ?, NOW(), 'Unread')
        `,
        [ProductID, `Sản phẩm ${productName}, ID: ${ProductID} hết hàng`]
      );
    }
    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ error: "Product not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Product updated successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating product:", err);

    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: err.message,
      }),
      { status: 500 }
    );
  }
}
