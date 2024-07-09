"use client";
import  { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useUserAuth } from "../auth/auth-context";
import Link from "next/link";
export default function Login() {
 
  const { user, emailSignIn } = useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();


  const handleSubmit = async (event) => {
    event.preventDefault();

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
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        } else {
          router.push('/Home');
        }

      } catch (error) {
        console.error('Unexpected server response:', error);
      }
  }

  return (
    <div className="flex h-screen">
      <div className="relative flex-col flex items-center justify-center w-1/2 bg-white">
        <div className="absolute  text-black top-0 right-6 text-5xl font-semibold mb-8">LOG</div>


        <form  onSubmit={handleSubmit}  className="max-w-2xl mx-auto p-8 pt-12 bg-white rounded-md shadow-2xl w-96">
         <div className="w-full max-w-md">

            <div className="mb-4">
              <label className="block text-black text-sm font-semibold mb-2">EMAIL</label>
              <input 
              type="email" 
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"/>
            </div>

            <div className="mb-4">
              <label className="block text-black text-sm font-semibold mb-2">PASSWORD</label>
              <input
              required  
              type="password" 
                onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" />
            </div>

            <button className="w-full p-4 bg-black text-white rounded-md font-semibold text-xl">
              CONTINUE
            </button>
          </div>
        </form>
        <div className="absolute bottom-28 left-0 w-full text-center mb-4">
          <Link className="mt-4 text-black text-2xl" href="/SignUp">
            <span>Don’t have an account?</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center w-1/2 bg-black relative">
        <div className="top-0 text-5xl font-semibold text-white absolute left-7">IN</div>
        <img src="Images/LOGO.png" alt="Logo" className="w-3/4 h-auto" />
      </div>
    </div>
  );
}
