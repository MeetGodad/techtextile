"use client";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../auth/firebase"; // Ensure this path is correct
import Swal from "sweetalert2";

export default function ForgotPassword({ onClose }) {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire({
        title: 'Password Reset Email Sent',
        text: 'Please check your email to reset your password.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      onClose(); // Close the modal or hide the component
    } catch (error) {
      console.error('Error sending password reset email:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to send password reset email. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-white p-4">
     
  
      <form 
        onSubmit={handleForgotPassword} 
        className="max-w-md mx-auto p-8 pt-12 bg-white rounded-lg shadow-2xl w-full md:w-96 animate-fadeInDown transition-all duration-700 ease-in-out"
      >
         <div className="absolute top-40 justify-center ml-20 self-center text-l md:text-l text-black font-semibold z-10 animate-fadeInUp">RESET PASSWORD</div>
        <div className="w-full">
          <div className="mb-6">
            <label className="block text-black text-sm font-semibold mb-2" htmlFor="email">EMAIL</label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition duration-300"
            />
          </div>
  
          <button 
            type="submit"
            className="w-full p-3 bg-black text-white rounded-md font-semibold text-lg hover:bg-gray-800 transition duration-300"
          >
            Send Reset Link
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-4 p-2 text-black text-sm font-bold hover:underline transition duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}