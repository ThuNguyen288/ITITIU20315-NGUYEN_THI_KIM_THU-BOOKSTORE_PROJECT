// src/app/api/forgotPassword/route.js
import { NextResponse } from 'next/server';
import db from '@/app/api/dbConect';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET;
const SMTP_EMAIL = process.env.SMTP_EMAIL;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// In-memory store for OTPs (in production use Redis or DB)
const otpStore = new Map();

export async function POST(req) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const body = await req.json();

  if (pathname.includes('forgotPassword')) return await handleForgotPassword(body);
  if (pathname.includes('verifyOtp')) return await handleVerifyOtp(body);
  if (pathname.includes('resetPassword')) return await handleResetPassword(body);

  return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
}

async function handleForgotPassword({ email }) {
  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

  const [users] = await db.query('SELECT * FROM customers WHERE Email = ?', [email]);
  if (users.length === 0) return NextResponse.json({ error: 'Email not found' }, { status: 404 });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

  // Send OTP via email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: SMTP_EMAIL, pass: SMTP_PASSWORD },
  });

  await transporter.sendMail({
    from: SMTP_EMAIL,
    to: email,
    subject: 'Your OTP Code',
    html: `<p>Your OTP code is: <b>${otp}</b>. It will expire in 5 minutes.</p>`
  });

  return NextResponse.json({ message: 'OTP sent' });
}

async function handleVerifyOtp({ email, otp }) {
  const stored = otpStore.get(email);
  if (!stored || stored.otp !== otp || stored.expires < Date.now()) {
    return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
  }

  // Generate short-lived token for resetting password
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '10m' });
  otpStore.delete(email);
  return NextResponse.json({ message: 'OTP verified', token });
}

async function handleResetPassword({ email, token, newPassword }) {
  if (!email || !token || !newPassword) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.email !== email) throw new Error('Token email mismatch');

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE customers SET Password = ? WHERE Email = ?', [hashed, email]);

    return NextResponse.json({ message: 'Password reset successful' });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }
}
