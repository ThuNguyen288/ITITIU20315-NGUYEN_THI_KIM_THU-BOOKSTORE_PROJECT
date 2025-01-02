import mysql from 'mysql2/promise';

// Configure the database connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true, // Đợi kết nối thay vì từ chối nếu không còn kết nối trống
    connectionLimit: 10, // Số lượng kết nối tối đa trong pool
    queueLimit: 0, // Số lượng truy vấn tối đa trong hàng đợi (0 = không giới hạn)
  });

export default db;
