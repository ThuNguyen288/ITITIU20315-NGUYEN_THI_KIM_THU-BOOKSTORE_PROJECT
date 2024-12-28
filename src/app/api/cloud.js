// lib/cloud.js
import cloudinary from 'cloudinary';

// Cấu hình Cloudinary sử dụng biến môi trường
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});


export default cloudinary;
