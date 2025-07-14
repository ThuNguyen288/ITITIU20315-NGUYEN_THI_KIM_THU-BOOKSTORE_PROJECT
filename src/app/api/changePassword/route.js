import { NextResponse } from 'next/server';
import db from '../dbConect';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const body = await req.json();
    const { oldPassword, newPassword } = body;

    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.id;

    const [rows] = await db.execute('SELECT * FROM customers WHERE CustomerID = ?', [userId]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(oldPassword, user.Password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE customers SET Password = ?, updated_at = NOW() WHERE CustomerID = ?', [hashedNewPassword, userId]);

    return NextResponse.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error in change-password API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
