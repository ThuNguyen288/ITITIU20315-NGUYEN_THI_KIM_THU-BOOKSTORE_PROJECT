import mysql from 'mysql2/promise'; 
export async function POST(req) {
  try {
    const body = await req.json();
    console.log('Request Body:', body); // Log incoming data

    const { email, password, name, dateOfBirth, address } = body;

    if (!email || !password || !name || !dateOfBirth || !address) {
      console.error('Missing fields:', body);
      return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('Database connected successfully');

    const [result] = await connection.execute(
      'INSERT INTO customers (Name, Password, Email, DateOfBirth, Address, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [name, password, email, dateOfBirth, address]
    );

    console.log('Database Insertion Result:', result); // Log the result

    await connection.end();

    return new Response(
      JSON.stringify({ message: 'User registered successfully', userId: result.insertId }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during database operation:', error);
    return new Response(JSON.stringify({ error: 'Database connection error' }), { status: 500 });
  }
}
