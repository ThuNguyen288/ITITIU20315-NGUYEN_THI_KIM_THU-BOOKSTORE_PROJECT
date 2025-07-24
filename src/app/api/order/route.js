import db from "../dbConect";

import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { CustomerID, total, cartItems, Address, Phone, PaymentMethod, Name } = body;
  console.log("📦 Dữ liệu nhận từ frontend:", { Address, Name, Phone });

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // STEP 1: Insert into orders
    const [orderResult] = await connection.query(
      `INSERT INTO orders (CustomerID, Total, OrderDate, Status, Address, Phone, PaymentMethod, Name) 
       VALUES (?, ?, NOW(), 'Pending', ?, ?, ?, ?)`,
      [CustomerID, total, Address, Phone, PaymentMethod, Name]
    );
    const orderId = orderResult.insertId;
    console.log("✅ STEP 1: orderId =", orderId);

    // STEP 2: Check stock and prepare orderdetails
    const orderDetailsData = [];
    for (const item of cartItems) {
      const [productRows] = await connection.query(
        "SELECT Stock FROM products WHERE ProductID = ?",
        [item.ProductID]
      );
      if (!productRows.length || productRows[0].Stock < item.Quantity) {
        throw new Error("Not enough stock for ProductID " + item.ProductID);
      }
      orderDetailsData.push([orderId, item.ProductID, item.Quantity, item.Price]);
    }
    console.log("✅ STEP 2: Stock checked");

    // STEP 3: Insert into orderdetails
    await connection.query(
      "INSERT INTO orderdetails (OrderID, ProductID, Quantity, Price) VALUES ?",
      [orderDetailsData]
    );
    console.log("✅ STEP 3: OrderDetails inserted");

    // STEP 4: Insert into revenue (based on cost)
    for (const item of cartItems) {
      const [costRows] = await connection.query(
        "SELECT Cost FROM products WHERE ProductID = ?",
        [item.ProductID]
      );
      const cost = costRows[0]?.Cost || 0;
      await connection.query(
        `INSERT INTO revenue (ProductID, Quantity, Price, Sale_date, Cost)
        VALUES (?, ?, ?, NOW(), ?)`,
        [
          item.ProductID,
          item.Quantity,
          item.Price,
          cost,
        ]
      );

    }
    console.log("✅ STEP 4: Revenue inserted");

    // STEP 5: Update stock
    for (const item of cartItems) {
      await connection.query(
        `UPDATE products SET Stock = Stock - ? WHERE ProductID = ?`,
        [item.Quantity, item.ProductID]
      );
    }
    console.log("✅ STEP 5: Stock updated");

    // STEP 6: Notification for low stock
    for (const item of cartItems) {
      const [stockRows] = await connection.query(
        "SELECT Stock FROM products WHERE ProductID = ?",
        [item.ProductID]
      );
      if (stockRows[0].Stock < 5) {
        await connection.query(
          `INSERT INTO notifications (type, content, isRead, created_at)
           VALUES (?, ?, 0, NOW())`,
          ['low_stock', `Sản phẩm ID ${item.ProductID} sắp hết hàng`]
        );
      }
    }
    console.log("✅ STEP 6: Low-stock notifications done");

    // STEP 7: Delete from cart
    await connection.query(
      `DELETE FROM cart WHERE CustomerID = ?`,
      [CustomerID]
    );
    console.log("✅ STEP 7: Cart deleted");

    // STEP 8: Order Notification
    for (const item of cartItems) {
  const message = `Bạn đã đặt sản phẩm ${item.Name} thành công!`;

  await connection.query(
    `INSERT INTO notifications 
     (CustomerID, OrderID, ProductID, Message, Status, CreatedAt, UpdatedAt) 
     VALUES (?, ?, ?, ?, 'Unread', NOW(), NOW())`,
    [CustomerID, orderId, item.ProductID, message]
  );
  }
    console.log("✅ STEP 8: Notifications inserted"); 
    // STEP 9: Increase tag scores + log ground truth
  for (const item of cartItems) {
  // 1. Lấy tag ID từ bảng products (TagID lưu dạng "1,3,5")
  const [rows] = await connection.query(
    `SELECT TagID FROM products WHERE ProductID = ?`,
    [item.ProductID]
  );

  if (rows.length && rows[0].TagID) {
    const tagIds = rows[0].TagID
      .split(',')
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id));

    for (const tagId of tagIds) {
      // 2. Cộng điểm vào bảng customer_tag_scores
      await connection.query(`
        INSERT INTO customer_tag_scores (CustomerID, TagID, Score)
        VALUES (?, ?, 2)
        ON DUPLICATE KEY UPDATE Score = Score + 2
      `, [CustomerID, tagId]);
    }
  }

  // 3. Ghi lại ground truth log cho sản phẩm đã mua
  await connection.query(
    `INSERT INTO ground_truth_logs (CustomerID, ProductID, ActionType, CreatedAt)
     VALUES (?, ?, 'purchase', NOW())`,
    [CustomerID, item.ProductID]
  );
}


    // STEP 10: Commit transaction
    await connection.commit();
    connection.release();
    console.log("✅ STEP 10: Commit...");

    return NextResponse.json({ success: true, orderId }, { status: 201 });

  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("❌ Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}