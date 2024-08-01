"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "../auth/auth-context";
import Swal from "sweetalert2";
import ForgotPassword from "./ForgotPassword";

export default function Login({ onSwitch }) {
  const { emailSignIn } = useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
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
        throw new Error(responseData.message);
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
      console.error('Login error:', error);
      
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error.message.includes('auth/')) {
        // Firebase authentication errors
        switch (error.message) {
          case 'auth/user-not-found':
            errorMessage = 'No user found with this email address.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled.';
            break;
          // Add more cases for other Firebase auth errors as needed
        }
      } else {
        // Database or other errors
        errorMessage = error.message;
      }

      Swal.fire({
        title: 'Login Failed',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-white p-4">
      <div className="absolute top-4 right-6 text-4xl md:text-5xl text-black font-semibold z-10 animate-fadeInUp">LOG</div>
  
      {!showForgotPassword ? (
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

            <button 
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="w-full mt-4 p-2 text-black text-sm font-bold hover:underline transition duration-300"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      ) : (
        <ForgotPassword onClose={() => setShowForgotPassword(false)} />
      )}
  
      <div className="absolute bottom-8 w-full text-center">
        <button 
          onClick={() => onSwitch('signup')} 
          className="text-black text-sm font-bold md:text-lg hover:underline mb-19 transition duration-300"
        >
          Don't have an account? Sign Up<br />
        </button>
      </div>
    </div>
  );
}