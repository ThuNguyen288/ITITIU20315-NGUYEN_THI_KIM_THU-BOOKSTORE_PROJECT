import db from '../dbConect'
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const saltRounds = 10;
    const body = await req.json();
    console.log('Request Body:', body); // Log incoming data

    const { email, password} = body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (!email || !password || !name) {
      console.error('Missing fields:', body);
      return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
    }

    console.log('Database connected successfully');

    const [rows] = await db.query('SELECT * FROM customers WHERE Email = ?', [email]);
    console.log('Database query result:', rows);

   if (rows.length === 1) {
  return new Response(JSON.stringify({ error: 'Email already exists' }), { status: 409 });
}

  
    const [result] = await db.execute(
      'INSERT INTO customers (Password, Email, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
      [hashedPassword, email]
    );
    

    console.log('Database Insertion Result:', result); // Log the result

    await db.end();

    return new Response(
      JSON.stringify({ message: 'User registered successfully', userId: result.insertId }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during database operation:', error);
    return new Response(JSON.stringify({ error: 'Database connection error' }), { status: 500 });
  }
}
