"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '../auth/auth-context';
export default function SignUp() {

    const { user, emailSignUp, } = useUserAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [LastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("");
    const [address, setAddress] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [companyName, setCompanyName] = useState("");
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();


        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        try {
            const userId = await emailSignUp(email, password);

            let data = {   
                userId,
                role,
                firstName,
                LastName,
                email,
                phone,
                address,
            }

            if (role === "seller") {
                data = {
                    ...data,
                    companyName,
                }
            } 
            
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                alert('User not found!');
            }
            else if (response.ok) {
                
                router.push('/Home');
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
                        <div className="flex mb-4 w-full">
                            <div className="w-1/2 pr-2">
                                <label className="block text-sm  text-black font-semibold mb-2">INTERESTED AS</label>
                                <select 
                                required
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full p-2 border text-black border-black rounded-md">
                                <option value="">Select an option</option>
                                <option value="buyer"  >As a Buyer</option>
                                <option value="seller">As a Seller</option>
                                </select>
                            </div>
                            {role === "seller" && (
                                <div className="w-1/2 pl-2">
                                    <label  className="block text-sm text-black font-semibold mb-2">Company Name</label>
                                    <input 
                                    type="text" 
                                    onChange={ (e) => setCompanyName(e.target.value)}
                                    required
                                    disabled={role !== "seller"}
                                    className="w-full p-2 border text-black border-black rounded-md"/>
                                    
                                </div>
                            )}
                        </div>
                        <div className="flex mb-4 w-full">
                            <div className="w-1/2 pr-2">
                            <label className="block text-sm text-black font-semibold mb-2">First Name</label>
                                <input 
                                type="text" 
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                disabled={role === ""}
                                className="w-full p-2 border text-black border-black rounded-md"/> 
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-sm text-black font-semibold mb-2">Last Name </label>
                                <input 
                                type="text" 
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                disabled={role === ""}
                                className="w-full p-2 border text-black border-black rounded-md"/>
                            </div>
                        </div>
                        <div className="flex mb-4 w-full">
                            <div className="w-1/2 pr-2">
                                <label className="block text-sm text-black font-semibold mb-2">Email</label>
                                <input 
                                type="email"
                                required
                                disabled={role === ""}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 border text-black border-black rounded-md" />
                            </div>
                            <div className="w-1/2 pl-2">
                                {role === "seller" ? (
                                <label className="block text-sm text-black font-semibold mb-2">COMPANY PHONE</label>
                                ) : (
                                <label className="block text-sm text-black font-semibold mb-2">PHONE</label>
                                )}
                                <input 
                                type="tel" 
                                required
                                disabled={role === ""}
                                pattern="[0-9]{10}"
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full p-2 border text-black border-black rounded-md"/>
                            </div>
                        </div>
                        <div className="flex mb-4 w-full">
                            <div className="w-1/2 pr-2">
                                <label className="block text-sm text-black font-semibold mb-2">PASSWORD</label>
                                <input 
                                type="password" 
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={role === ""}
                                className="w-full p-2 border  text-black border-black rounded-md"/>
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-sm text-black font-semibold mb-2">CONFIRM PASSWORD</label>
                                <input 
                                type="password" 
                                required
                                disabled={role === ""}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-2 border text-black border-black rounded-md" />
                            </div>
                        </div>
                            <div className="mb-4 w-full">
                                {role === "seller" ? (
                                <label className="block text-sm text-black font-semibold mb-2">COMPANY ADDRESS</label>
                                ) : (
                                <label className="block text-sm text-black font-semibold mb-2">ADDRESS</label>
                                )}
                                <input 
                                type="text" 
                                required
                                disabled={role === ""}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full p-2 border border-black rounded-md" />
                            </div>
                        <button className="w-96 p-4 bg-black text-white rounded-md font-semibold text-xl">
                            <Link href= "/Home">
                            CREATE AN ACCOUNT
                            </Link> </button>
                    </div>
                </div>
                </form>
                <Link href="/Login" className="mt-4  text-black text-xl">Already Have An Account ? Login Then</Link>
            </div>
        </div>
    );
}
