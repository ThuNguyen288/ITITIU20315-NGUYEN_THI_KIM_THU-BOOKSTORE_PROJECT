import db from "@/app/api/dbConect"

export async function GET(req, { params }) {
  try {
    const customerID = params.CustomerID
    if (!customerID) {
      return new Response(JSON.stringify({ error: "Thiếu Customer ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const [rows] = await db.execute(
      `SELECT * FROM customers WHERE CustomerID = ?`,
      [customerID]
    )
    console.log(rows)

    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ error: "Không tìm thấy người dùng" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify(rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("Error fetching customer data:", err)
    return new Response(JSON.stringify({ error: "Lỗi server" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function PUT(req, { params }) {
  try {
    // Await params to ensure they are fully resolved
    const { CustomerID } = await params;
    console.log(CustomerID)
    if (!CustomerID) {
      return new Response(JSON.stringify({ error: "Thiếu Customer ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { Name, Email, PhoneNumber, DateOfBirth, Address } = body;
    if (!Name || !Email || !PhoneNumber || !DateOfBirth || !Address) {
      return new Response(JSON.stringify({ error: "Thiếu thông tin cần thiết" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const [result] = await db.execute(
      `UPDATE customers 
       SET Name = ?, Email = ?, PhoneNumber = ?, DateOfBirth = ?, Address = ?, updated_at = NOW()
       WHERE CustomerID = ?`,
      [Name, Email, PhoneNumber, DateOfBirth, Address, CustomerID]
    );

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Không tìm thấy người dùng" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Cập nhật thành công" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    return new Response(JSON.stringify({ error: "Lỗi server" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

