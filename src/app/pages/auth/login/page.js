'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '/src/app/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '/public/Logo/logo.png';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      login(data.user.token, {
        id: data.user.id,
        name: data.user.name,
        role_id: data.user.role_id,
      });

      router.push('/pages/main/customer/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-secondaryCustom to-primaryCustom">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <Image src={Logo} alt="Logo" className="mx-auto h-16 w-auto" />
          <h2 className="mt-6 text-2xl font-bold text-gray-800">Sign in to your account</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 border rounded-full text-sm focus:ring-2 focus:ring-primaryCustom-dark"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border rounded-full text-sm focus:ring-2 focus:ring-primaryCustom-dark"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-gradient-to-r from-secondaryCustom to-primaryCustom text-white py-3 rounded-full font-semibold hover:opacity-90 transition"
          >
            {status === 'loading' ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 space-y-1 pt-2">
          <p>
            Forgot password?{' '}
            <Link href="./forgotPassword" className="text-primaryCustom-dark hover:underline">
              Reset here
            </Link>
          </p>
          <p>
            Don’t have an account?{' '}
            <Link href="./register" className="text-primaryCustom-dark hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
