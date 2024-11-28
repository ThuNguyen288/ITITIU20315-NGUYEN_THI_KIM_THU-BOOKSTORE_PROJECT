import { NextResponse } from 'next/server';
import db from '../dbConect'; // Adjust the path to your database utility file
import jwt from 'jsonwebtoken';
export async function POST(req) {
  try {
    const body = await req.json(); // Parse the request body
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Query the database
    const [rows] = await db.query('SELECT * FROM customers WHERE Email = ?', [email]);
    console.log('Database query result:', rows);
    if (rows.length === 0 || rows[0].Password !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const user = rows[0];
    // Generate a JSON Web Token (JWT) for the user
    const token = jwt.sign(
      { userId: user.CustomerID, role_id: user.role_id }, 
      process.env.SECRET_KEY, 
      { expiresIn: '1h' }
    );

    // Return success response with user data and token
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.CustomerID,
        name: user.Name,
        email: user.Email,
        role_id: user.role_id,
        phone: user.PhoneNumber,
        address: user.Address,
      },
      token,
    });
      } catch (error) {
    console.error('Error in login API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
