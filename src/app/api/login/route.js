import { NextResponse } from 'next/server';
import db from '../dbConect'; // Đảm bảo đúng đường dẫn tới file kết nối DB
import bcrypt from 'bcrypt';

// POST method
export async function POST(req) {
  try {
    const body = await req.json(); // Phân tích dữ liệu body
    const { email, password } = body;

    // Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Query cơ sở dữ liệu
    const [rows] = await db.query('SELECT * FROM customers WHERE Email = ?', [email]);

    // Kiểm tra nếu không có người dùng nào
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const user = rows[0];

    // Kiểm tra mật khẩu
    const isPasswordCorrect = await bcrypt.compare(password, user.Password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Trả về thông tin người dùng sau khi đăng nhập thành công
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.CustomerID,
        name: user.Name,
        email: user.Email,
        role_id: user.role_id, // Nếu trường này tồn tại trong cơ sở dữ liệu
        phone: user.PhoneNumber,
        address: user.Address,
      },
    });
  } catch (error) {
    console.error('Error in login API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
