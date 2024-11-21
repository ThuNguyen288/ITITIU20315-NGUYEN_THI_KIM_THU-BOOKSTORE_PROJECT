'use client'; // This marks the file as a Client Component

import 'bootstrap/dist/css/bootstrap.min.css';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import './Register.css';

// Dynamically load Bootstrap JS to avoid SSR issues
const Bootstrap = dynamic(() => import('bootstrap/dist/js/bootstrap.bundle.min.js'), { ssr: false });

export default function SignUp() {
  // Define state for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [login, setLogin] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !name || !dateOfBirth || !address) {
      alert('All fields are required');
      return;
    }

    const userData = { email, password, name, dateOfBirth, address };

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message); // Success message
      } else {
        alert(result.error); // Error message
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="w-1/2 row justify-center place-self-center">
      <div className="col-md-4 p-5">
        <h2 className="text-center">Sign Up</h2>
      </div>
      <form className="border-2 py-5 w-75 place-items-center rounded shadow-sm" onSubmit={handleSubmit}>
        <div className="col-10">
          <label htmlFor="inputEmail4" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="inputEmail4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="col-10">
          <label htmlFor="inputPassword4" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="inputPassword4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="col-10">
          <label htmlFor="inputName" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="inputName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="col-10">
          <label htmlFor="inputDateOfBirth" className="form-label">Date of Birth</label>
          <input
            type="date"
            className="form-control"
            id="inputDateOfBirth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
        </div>
        <div className="col-10">
          <label htmlFor="inputAddress" className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            id="inputAddress"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="col-10 py-4">
          <div className="form-check">
            <input className="form-check-input scale-150" type="checkbox" id="gridCheck" />
            <label className="form-check-label" htmlFor="gridCheck">
              Let me Log in
            </label>
          </div>
        </div>
        <div className="col-10">
          <button type="submit" className="btn btn-primary">Sign Up</button>
        </div>
      </form>
    </div>
  );
}
