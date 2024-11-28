'use client'; // This marks the file as a Client Component

import 'bootstrap/dist/css/bootstrap.min.css';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// Dynamically load Bootstrap JS to avoid SSR issues
const Bootstrap = dynamic(() => import('bootstrap/dist/js/bootstrap.bundle.min.js'), { ssr: false });

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Dynamically load Bootstrap JS on the client side
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  const router = useRouter();

  useEffect(() => {
    router.push('/pages/main/dashboard');
  }, [router]);

  return null;
}
