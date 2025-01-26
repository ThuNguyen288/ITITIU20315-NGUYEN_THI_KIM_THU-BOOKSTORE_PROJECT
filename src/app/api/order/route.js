import db from '../dbConect'; // Ensure the correct path to the DB connection

// POST method to place an order
export async function POST(req) {
  const { CustomerID, items, total } = await req.json();

  if (!CustomerID || !items || items.length === 0 || !total) {
    return new Response(
      JSON.stringify({ message: 'Missing required fields.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Start transaction
    await db.query('START TRANSACTION');

    // Create a new order
    const [orderResult] = await db.query(`
      INSERT INTO orders (CustomerID, Total, OrderDate)
      VALUES (?, ?, NOW())
    `, [CustomerID, total]);

    const orderId = orderResult.insertId;

    // Insert order details and reduce stock
    for (const item of items) {
      // Insert order details
      await db.query(`
        INSERT INTO orderdetails (OrderID, ProductID, Quantity, Price)
        VALUES (?, ?, ?, ?)
      `, [orderId, item.ProductID, item.Quantity, item.Price]);

      // Reduce product stock in the products table
      await db.query(`
        UPDATE products
        SET Stock = Stock - ?, Sold = Sold + ?
        WHERE ProductID = ?
      `, [item.Quantity, item.Quantity, item.ProductID]);
      
      const [product] = await db.execute(
        "SELECT Name, Stock FROM products WHERE ProductID = ?",
        [item.ProductID]
      );
  
      if (product.length === 0) {
        return new Response(
          JSON.stringify({ error: `Product with ID ${item.ProductID} not found after update` }),
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
          [item.ProductID, `Sản phẩm ${productName}, ID: ${item.ProductID} hết hàng`]
        );
      }

      // Optionally, remove the item from the cart (if there’s a cart system)
      await db.query(`
        DELETE FROM cart WHERE CustomerID = ? AND ProductID = ?
      `, [CustomerID, item.ProductID]);
    }

    // Create a notification for the admin about the new order
    await db.query(`
      INSERT INTO notifications (CustomerID, OrderID, Message, CreatedAt, Status)
      VALUES (?, ?, ?, NOW(), 'Unread')
    `, [CustomerID, orderId, `Đơn hàng mới được tạo, ID: ${orderId}, khách hàng: ${CustomerID}, total: ${total}` ]);

    // Commit transaction
    await db.query('COMMIT');

    return new Response(
      JSON.stringify({ message: 'Order placed successfully', orderId }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // Rollback transaction
    await db.query('ROLLBACK');
    console.error('Error placing order:', error);

    return new Response(
      JSON.stringify({ error: 'Failed to place order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
