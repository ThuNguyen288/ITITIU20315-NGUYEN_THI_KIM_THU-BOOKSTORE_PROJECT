'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('idle');
  const [timer, setTimer] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer((t) => t - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const handleSendEmail = async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/forgotPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, step: 'send' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
      toast.success('OTP sent to your email');
      setToken(data.token);
      setStep(2);
      setTimer(60);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setStatus('idle');
    }
  };

  const handleVerifyOtp = async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/forgotPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token },
        body: JSON.stringify({ email, otp, step: 'verify' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'OTP is invalid');
      toast.success('OTP verified');
      setStep(3);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setStatus('idle');
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    setStatus('loading');
    try {
      const res = await fetch('/api/forgotPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token },
        body: JSON.stringify({ email, otp, newPassword, step: 'reset' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reset failed');
      toast.success('Password updated! Redirecting...');
      setTimeout(() => {
        router.push('./login');
      }, 2000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-secondaryCustom to-primaryCustom">
      <Toaster />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Forgot Password</h2>

        {step === 1 && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Enter Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full px-4 py-3 border rounded-full text-sm focus:ring-2 focus:ring-primaryCustom-dark"
              />
            </div>
            <button
              onClick={handleSendEmail}
              disabled={status === 'loading'}
              className="w-full bg-gradient-to-r from-secondaryCustom to-primaryCustom text-black py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {status === 'loading' ? 'Sending...' : 'Send'}
            </button>
            <p className="text-center text-sm text-gray-500">
              Back to sign in? <span className="text-primaryCustom-dark hover:underline cursor-pointer">Login</span>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Enter Verification Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 border rounded-full text-center outline-none tracking-widest text-lg focus:ring-primaryCustom-dark"
              />
            </div>
            <div className="text-sm text-gray-500 text-center">
              {timer > 0 ? (
                <span>Resend in {timer}s</span>
              ) : (
                <button onClick={handleSendEmail} className="text-primaryCustom-dark hover:underline ml-2">
                  Resend
                </button>
              )}
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={status === 'loading'}
              className="w-full bg-gradient-to-r from-secondaryCustom to-primaryCustom text-white py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {status === 'loading' ? 'Verifying...' : 'Send'}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Enter New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-full text-sm focus:ring-primaryCustom-dark"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-full text-sm focus:ring-2 focus:ring-primaryCustom-dark"
              />
            </div>
            <button
              onClick={handleResetPassword}
              disabled={status === 'loading'}
              className="w-full mt-4 bg-gradient-to-r from-secondaryCustom to-primaryCustom text-white py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {status === 'loading' ? 'Updating...' : 'Send'}
            </button>
          </>
        )}

        <div className="pt-6">
          <button className="w-full border border-gray-300 text-sm py-2 rounded-full text-gray-600 hover:bg-gray-50 transition">
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
