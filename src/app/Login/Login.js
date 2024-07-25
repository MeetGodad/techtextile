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
    <div className="relative flex flex-col items-center justify-center w-full bg-white">
      <div className="absolute top-4 right-3 text-5xl text-black font-semibold mb-8">LOG</div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-8 pt-12 bg-white rounded-md shadow-2xl w-96">
        <div className="w-full max-w-md">
          <div className="mb-4">
            <label className="block text-black text-sm font-semibold mb-2">EMAIL</label>
            <input
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-black text-sm font-semibold mb-2">PASSWORD</label>
            <input
              required
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <button className="w-full p-4 bg-black text-white rounded-md font-semibold text-xl">
            CONTINUE
          </button>
        </div>
      </form>
      <div className="absolute bottom-28 left-0 w-full text-center mb-4">
        <button onClick={() => onSwitch('signup')} class="text-black text-xl hover:underline transition duration-300">
          Don’t have an account?
        </button>
      </div>
    </div>
  );

}
