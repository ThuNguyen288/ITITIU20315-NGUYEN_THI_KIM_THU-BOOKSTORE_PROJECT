import { NextResponse } from 'next/server';
import db from '../dbConect'; // Adjust the path to your database utility file

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

    // Return success response
    return NextResponse.json({ message: 'Login successful', user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Error in login API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
