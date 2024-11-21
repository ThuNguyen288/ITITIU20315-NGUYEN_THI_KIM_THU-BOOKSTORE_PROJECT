'use client'; // This marks the file as a Client Component

import 'bootstrap/dist/css/bootstrap.min.css';
import dynamic from 'next/dynamic';

// Dynamically load Bootstrap JS to avoid SSR issues
const Bootstrap = dynamic(() => import('bootstrap/dist/js/bootstrap.bundle.min.js'), { ssr: false });

import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Register.css'
export default function SignUp(){
  useEffect(() => {
    // Dynamically load Bootstrap JS on the client side
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []); 
    return (
        <div className="w-1/2 row justify-center place-self-center">
            <div className="col-md-4 p-5">
                <h2 className="text-center">Sign Up</h2>
            </div>
            <form className="border-2 py-5 w-75 place-items-center rounded shadow-sm">
            <div className="col-10">
                <label htmlFor="inputEmail4" className="form-label">Email</label>
                <input type="email" className="form-control" id="inputEmail4" />
            </div>
            <div className="col-10">
                <label htmlFor="inputPassword4" className="form-label">Password</label>
                <input type="password" className="form-control" id="inputPassword4" />
            </div>
            <div className="col-10">
                <label htmlFor="inputName" className="form-label">Name</label>
                <input type="date" className="form-control" id="inputName" placeholder="DD/MM/YYYY" />
            </div>
            <div className="col-10">
                <label htmlFor="inputDateOfBirth" className="form-label">Date of birth</label>
                <input type="date" className="form-control" id="inputDateOfBirth" placeholder="DD/MM/YYYY" />
            </div>
            <div className="col-10">
                <label htmlFor="inputAddress" className="form-label">Address</label>
                <input type="text" className="form-control" id="inputAddress" placeholder="1234 Main St" />
            </div>
            <div className="col-10 py-4">
                <div className="form-check">
                <input className="form-check-input scale-150" type="checkbox" id="gridCheck" />
                <label className="form-check-label" htmlFor="gridCheck">
                    Check me out
                </label>
                </div>
            </div>
            <div className="col-10">
                <button type="submit" className="btn btn-primary">Sign in</button>
            </div>
            </form>
        </div>

    )
}