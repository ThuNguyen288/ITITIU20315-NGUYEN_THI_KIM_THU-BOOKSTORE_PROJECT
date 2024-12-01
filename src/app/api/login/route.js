import { NextResponse } from 'next/server';
import db from '../dbConect'; // Đảm bảo đúng đường dẫn tới file kết nối DB

export async function POST(req) {
  try {
    const body = await req.json(); // Phân tích dữ liệu body
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Query cơ sở dữ liệu
    const [rows] = await db.query('SELECT * FROM customers WHERE Email = ?', [email]);
    if (rows.length === 0 || rows[0].Password !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const user = rows[0];
    // Lưu customerId và roleId vào localStorage
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.CustomerID,
        name: user.Name,
        email: user.Email,
        role_id: user.role_id,
        phone: user.PhoneNumber,
        address: user.Address,
      }
    });

  } catch (error) {
    console.error('Error in login API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
