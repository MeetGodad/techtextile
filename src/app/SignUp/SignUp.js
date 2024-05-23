"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useUserAuth } from '../auth/auth-context';
export default function SignUp() {

    const { user, emailSignUp, firebaseSignOut } = useUserAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("");
    const [address, setAddress] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    
const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        try {
            const userId = await emailSignUp(email, password);
        
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    role,
                    name,
                    email,
                    phone,
                    address
                }
                ),
            });
    
            if (!response.ok) {
                alert('User not found!');
            }
            const data = await response.json();
            
            if (data.user) {
                const userRole = data.user.usertype;
                console.log('User role:', userRole);
            
                if (userRole === 'buyer') {
                    alert('You are a buyer now!')
                } else if (userRole === 'seller') {
                    alert('You are a seller now!') 
                }
            } else {
                console.error('Unexpected server response:', data);
            }


        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
              alert("Email address is already in use.");
            } else {
              console.error("Failed to sign up:", error);
              alert("Failed to sign up: " + error.message);
            }
        }
    }



    
    return (
        <div className="flex h-screen">
            <div className="flex items-center justify-center w-1/2 bg-black relative">
                <div className="top-0 text-5xl font-semibold text-white absolute right-3">SIGN</div>
                <img src="Images/LOGO.png" alt="Logo" className="w-3/4 h-auto" />
            </div>
            <div className="relative flex flex-col items-center justify-center w-1/2 bg-white">
                <div className="absolute top-0 left-3 text-5xl text-black font-semibold mb-8">UP</div>
        
            <form onSubmit={handleSubmit} className="w-full max-w-md text-black ">
                <div className="w-full max-w-md text-black ">
                    <div className="flex flex-col items-center mb-4">
                        <div className="w-1/2 pr-2 mb-5">
                            <label className="block text-sm  text-black font-semibold mb-2">INTERESTED AS</label>
                            <select 
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full p-2 border text-black border-black rounded-md">
                            <option value="">Select an option</option>
                            <option value="buyer"  >As a Buyer</option>
                            <option value="seller">As a Seller</option>
                            </select>
                        </div>
                        <div className="flex mb-4 w-full">
                            <div className="w-1/2 pr-2">
                                <label className="block text-sm text-black font-semibold mb-2">NAME</label>
                                <input 
                                type="text" 
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full p-2 border text-black border-black rounded-md"/>
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-sm text-black font-semibold mb-2">Email</label>
                                <input 
                                type="email"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 border text-black border-black rounded-md" />
                            </div>
                        </div>
                        <div className="flex mb-4 w-full">
                            <div className="w-1/2 pr-2">
                                <label className="block text-sm text-black font-semibold mb-2">PASSWORD</label>
                                <input 
                                type="password" 
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-2 border  text-black border-black rounded-md"/>
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-sm text-black font-semibold mb-2">CONFIRM PASSWORD</label>
                                <input 
                                type="password" 
                                required
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-2 border text-black border-black rounded-md" />
                            </div>
                        </div>
                        <div className="flex mb-4 w-full">
                            <div className="w-1/2 pr-2">
                                <label className="block text-sm text-black font-semibold mb-2">PHONE</label>
                                <input 
                                type="tel" 
                                required
                                pattern="[0-9]{10}"
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full p-2 border text-black border-black rounded-md"/>
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-sm text-black font-semibold mb-2">ADDRESS</label>
                                <input 
                                type="text" 
                                required
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full p-2 border border-black rounded-md" />
                            </div>
                        </div>
                        <button className="w-96 p-4 bg-black text-white rounded-md font-semibold text-xl">
                            CONTINUE
                        </button>
                    </div>
                </div>
            </form>
                <Link href="/Login" className="mt-4  text-black text-xl">Already Have An Account ? Login Then</Link>
            </div>
        </div>
    );
}
