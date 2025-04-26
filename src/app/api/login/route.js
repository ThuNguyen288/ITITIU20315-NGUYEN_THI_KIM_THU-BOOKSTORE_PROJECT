import { NextResponse } from 'next/server';
import db from '../dbConect'; // Đảm bảo đúng đường dẫn tới file kết nối DB
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Lấy biến môi trường
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || '1h'; // Mặc định 1 giờ nếu không có trong .env

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const [rows] = await db.query('SELECT * FROM customers WHERE Email = ?', [email]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const user = rows[0];

    const isPasswordCorrect = await bcrypt.compare(password, user.Password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Tạo JWT với thời gian hết hạn là 1 giờ
    const token = jwt.sign(
      { id: user.CustomerID, email: user.Email, role_id: user.role_id },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN }
    );

    // Thiết lập cookie với HttpOnly để bảo mật
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.CustomerID,
        name: user.Name,
        email: user.Email,
        role_id: user.role_id,
        phone: user.PhoneNumber,
        address: user.Address,
        token: token, // Trả về token cho frontend
      },
    });

    response.cookies.set('token', token, {
      httpOnly: true, // Ngăn JavaScript truy cập token
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 giờ
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error in login API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
