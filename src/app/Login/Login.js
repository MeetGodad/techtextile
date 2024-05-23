"use client";
import  { useState } from "react";
import { useUserAuth } from "../auth/auth-context";
import Link from "next/link";

export default function Login() {
 
  const { user, emailSignIn } = useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {

    try {
        const userId = await emailSignIn(email, password);

        console.log('User ID:', userId);
        
        const response = await fetch(`api/auth/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          alert('User not found!');
        }

        const data = await response.json();

        if (data.user) {
          const userRole = data.user.usertype;
          const userName = data.user.username;
          console.log('User role:', userRole);

          if (userRole === 'buyer') {
            alert('Welcome back! ' + userName )
          } else if (userRole === 'seller') {
            alert('Welcome back! Seller ' + userName )
          }
        }

      } catch (error) {
        console.error('Unexpected server response:', error);
      }
  }

  return (
    <div className="flex h-screen">
      <div className="relative flex-col flex items-center justify-center w-1/2 bg-white">
        <div className="absolute  text-black top-0 right-6 text-5xl font-semibold mb-8">LOG</div>

        <div className="w-full max-w-md">

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
            onClick={() => handleSubmit()}
           className="w-full p-4 bg-black text-white rounded-md font-semibold text-xl">
            CONTINUE
          </button>
        </div>

        <Link className="mt-4 text-black text-xl" href="/SignUp">Don’t have an account?</Link>
      </div>

      <div className="flex items-center justify-center w-1/2 bg-black relative">
        <div className="top-0 text-5xl font-semibold text-white absolute left-7">IN</div>
        <img src="Images/LOGO.png" alt="Logo" className="w-3/4 h-auto" />
      </div>
    </div>
  );
}