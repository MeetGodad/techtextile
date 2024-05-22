"use client";
import  { useState } from "react";
import { useUserAuth } from "../auth/auth-context";

export default function Login() {
 
  const { user, emailSignIn,  firebaseSignOut } = useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOnClick = async () => {
    const userId = await emailSignIn(email, password);
    
    // Send userId to your backend to get the user's role
    const response = await fetch('api/Login', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      alert('User not found!');
    }
    const data = await response.json();
    const userRole = data.role;
  
    
    if (userRole === 'buyer') {
      
    } else if (userRole === 'seller') {
      
    }
  }

  return (
    <div className="flex h-screen">
      <div className="relative flex-col flex items-center justify-center w-1/2 bg-white">
        <div className="absolute  text-black top-0 right-6 text-5xl font-semibold mb-8">LOG</div>

        <div className="w-full max-w-md">
          <div className="mb-4 text-black">
            <label className="block text-sm  text-black font-semibold mb-2">INTERESTED AS</label>
            <select className="w-full p-2 border border-black rounded-md">
              <option value="">Select an option</option>
              <option value="buyer">As a Buyer</option>
              <option value="seller">As a Seller</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-black text-sm font-semibold mb-2">EMAIL</label>
            <input 
            type="email" 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border text-black border-black rounded-md"/>
          </div>

          <div className="mb-4">
            <label className="block text-black text-sm font-semibold mb-2">PASSWORD</label>
            <input
             type="password" 
              onChange={(e) => setPassword(e.target.value)}
             className="w-full p-2 border text-black border-black rounded-md" />
          </div>

          <button
            onClick={() => }
           className="w-full p-4 bg-black text-white rounded-md font-semibold text-xl">
            CONTINUE
          </button>
        </div>

        <a className="mt-4 text-black text-xl" href="">Don’t have an account?</a>
      </div>

      <div className="flex items-center justify-center w-1/2 bg-black relative">
        <div className="top-0 text-5xl font-semibold text-white absolute left-7">IN</div>
        <img src="Images/LOGO.png" alt="Logo" className="w-3/4 h-auto" />
      </div>
    </div>
  );
}
