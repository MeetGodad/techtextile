"use client";
import  { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useUserAuth } from "../auth/auth-context";
import Link from "next/link";
import Swal from "sweetalert2";

export default function Login( {onSwitch} ) {
 
  const { user, emailSignIn } = useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        const userId = await emailSignIn(email, password);

        console.log('User ID:', userId);
        
        const response = await fetch(`/api/auth/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const responseData = await response.json();

        if (!response.ok) {
          alert(`Error: ${responseData.message}`);
        } else {
          Swal.fire({
            title: 'Login Successful',
            text: 'Welcome back!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            router.push('/Home');
          });
        }

      } catch (error) {
        console.error('Unexpected server response:', error);
        Swal.fire({
          title: 'Login Failed',
          text: 'Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
  }

  return (

    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-white p-4">
      <div className="absolute top-4 right-6 text-4xl md:text-5xl text-black font-semibold z-10 animate-fadeInUp">LOG</div>
  
      <form 
        onSubmit={handleSubmit} 
        className="max-w-md mx-auto p-8 pt-12 bg-white rounded-lg shadow-2xl w-full md:w-96 animate-fadeInDown transition-all duration-700 ease-in-out"
      >
        <div className="w-full">
          <div className="mb-6">
            <label className="block text-black text-sm font-semibold mb-2" htmlFor="email">EMAIL</label>
            <input
              type="email"
              id="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition duration-300"
            />
          </div>
  
          <div className="mb-6">
            <label className="block text-black text-sm font-semibold mb-2" htmlFor="password">PASSWORD</label>
            <input
              type="password"
              id="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition duration-300"
            />
          </div>
  
          <button 
            type="submit"
            className="w-full p-3 bg-black text-white rounded-md font-semibold text-lg hover:bg-gray-800 transition duration-300"
          >
            CONTINUE
          </button>
        </div>
      </form>
  
      <div className="absolute bottom-8 w-full text-center">
        <button 
          onClick={() => onSwitch('signup')} 
          className="text-black text-sm font-bold md:text-lg hover:underline mb-24 transition duration-300"
        >
          Don’t have an account? Sign Up<br />
        </button>
      </div>
    </div>
  );
}  