import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, dateOfBirth, address } = req.body;

  if (!email || !password || !dateOfBirth || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Create a connection to the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Insert user into the database
    const [result] = await connection.execute(
      'INSERT INTO customer (Name, Password, Email, DateOfBirth, PhoneNumber, Address, created_at, updated_at)) VALUES (?, ?, ?, ?, ?, ?)',
      [name, password, email, dateOfBirth, phoneNumber, address, ]
    );

    await connection.end();

    return res.status(200).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database connection error' });
  }
}
