import db from '../dbConect'; // Ensure the correct path to the DB connection

// POST method to place an order
export async function POST(req) {
  const { CustomerID, items, total, name, address, phone, email, paymentMethod } = await req.json();

  if (!CustomerID || !items || items.length === 0 || !total) {
    return new Response(
      JSON.stringify({ message: 'Missing required fields.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    await db.query('START TRANSACTION');

    // 1️⃣ Tạo đơn hàng
    const [orderResult] = await db.query(`
      INSERT INTO orders (CustomerID, Total, OrderDate, Address, Phone, Name, PaymentMethod)
      VALUES (?, ?, NOW(), ?, ?, ?, ?)
    `, [CustomerID, total, address, phone, name, paymentMethod]);

    const orderId = orderResult.insertId;

    // 2️⃣ Kiểm tra và cập nhật kho hàng
    for (const item of items) {
      const [stockCheck] = await db.execute(
        "SELECT Stock FROM products WHERE ProductID = ?",
        [item.ProductID]
      );

      if (stockCheck.length === 0 || stockCheck[0].Stock < item.Quantity) {
        throw new Error(`Sản phẩm ID ${item.ProductID} không đủ hàng`);
      }
    }

    // 3️⃣ Chèn chi tiết đơn hàng và cập nhật doanh thu
    const orderDetailsValues = items.map(item => `(${orderId}, ${item.ProductID}, ${item.Quantity}, ${item.Price})`).join(',');
    await db.query(`INSERT INTO orderdetails (OrderID, ProductID, Quantity, Price) VALUES ${orderDetailsValues}`);

    const revenueValues = items.map(item => `(${item.ProductID}, ${item.Quantity}, ${item.Price}, ${item.Cost * item.Quantity || 0}, CURDATE())`).join(',');
    await db.query(`INSERT INTO revenue (ProductID, Quantity, Price, Cost, Sale_date) VALUES ${revenueValues}`);
console.log(revenueValues)
    // 4️⃣ Cập nhật kho hàng
    for (const item of items) {
      await db.query(`
        UPDATE products
        SET Stock = Stock - ?, Sold = Sold + ?
        WHERE ProductID = ?
      `, [item.Quantity, item.Quantity, item.ProductID]);
    }

    // 5️⃣ Gửi thông báo hết hàng
    for (const item of items) {
      const [product] = await db.execute(
        "SELECT Name, Stock FROM products WHERE ProductID = ?",
        [item.ProductID]
      );

      if (product.length > 0 && product[0].Stock === 0) {
        await db.execute(`
          INSERT INTO notifications (ProductID, Message, CreatedAt, Status)
          VALUES (?, ?, NOW(), 'Unread')
        `, [item.ProductID, `${product[0].Name} out of stock`]);
      }

      if (product.length > 0 && product[0].Stock <= 10) {
        await db.execute(`
          INSERT INTO notifications (ProductID, Message, CreatedAt, Status)
          VALUES (?, ?, NOW(), 'Unread')
        `, [item.ProductID, `${product[0].Name} low of stock`]);
      }
    }

    // 6️⃣ Xóa giỏ hàng của khách hàng
    await db.query(`
      DELETE FROM cart WHERE CustomerID = ?
    `, [CustomerID]);

    // 7️⃣ Gửi thông báo đơn hàng mới
    await db.query(`
      INSERT INTO notifications (CustomerID, OrderID, Message, CreatedAt, Status)
      VALUES (?, ?, ?, NOW(), 'Unread')
    `, [CustomerID, orderId, `New order from customer - ${email}, total: ${total}` ]);

    await db.query('COMMIT');
    return new Response(JSON.stringify({ message: 'Order placed successfully', orderId }), { status: 201 });

} catch (error) {
    await db.query('ROLLBACK');
    console.error('Error placing order:', error);

    return new Response(JSON.stringify({ error: error.message || 'Failed to place order' }), { status: 500 });
}
}
