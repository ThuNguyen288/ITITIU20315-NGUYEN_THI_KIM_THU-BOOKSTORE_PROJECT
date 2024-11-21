'use client'; // This marks the file as a Client Component

import Banner from "./components/Banner";
import Header from "./components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import dynamic from 'next/dynamic';

// Dynamically load Bootstrap JS to avoid SSR issues
const Bootstrap = dynamic(() => import('bootstrap/dist/js/bootstrap.bundle.min.js'), { ssr: false });

import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  useEffect(() => {
    // Dynamically load Bootstrap JS on the client side
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  return (
    <div>
      <Header />
      <Banner />
    </div>
  );
}
