"use client";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth} from '../auth/auth-context';
import { auth } from '../auth/firebase';
import { sendEmailVerification , deleteUser , reload} from 'firebase/auth';
export default function SignUp() {

    const { emailSignUp} = useUserAuth();
    const [currentStep, setCurrentStep] = useState(1);
    
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [LastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("");
    const [street , setStreet] = useState("");
    const [city , setCity] = useState("");
    const [state , setState] = useState("");
    const [postalCode , setPostalCode] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [companyName, setCompanyName] = useState("");
    const user = useUserAuth();
    const router = useRouter();


    const handleSubmit = async (event) => {
            event.preventDefault();


            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }


            try {
                const userId = await emailSignUp(email, password);

                const checkUserAvailable = async () => {
                    if (user) {
                        return Promise.resolve(user);
                    } else {
                        // Check again after 1 second
                        return new Promise((resolve, reject) => {
                            setTimeout(() => {
                                if (user) {
                                    resolve(user);
                                } else {
                                    reject(new Error('User not available'));
                                }
                            }, 1000);
                        });
                    }
                };
                checkUserAvailable();

                if (user) {
                    try {
                        await sendEmailVerification(auth.currentUser);
                        alert('Verification email sent(Please Verify In 30 Seconds)!');
                
                        // Function to check if the email is verified
                        const checkEmailVerified = async () => {
                            let timeoutId;
                            const timeoutPromise = new Promise((_, reject) => {
                            timeoutId = setTimeout(() => reject(new Error('Email verification timeout')), 30000);
                            });
                        
                            const checkPromise = new Promise((resolve, reject) => {
                            const check = async () => {
                                await auth.currentUser.reload();
                                const user = auth.currentUser; 
                                if (user.emailVerified) {
                                clearTimeout(timeoutId); // Clear the timeout if the email is verified
                                resolve();
                                } else {
                                // Check again after 5 seconds
                                setTimeout(check, 2000);
                                }
                            };
                            check();
                            });
                        
                            // Wait for either the checkPromise or timeoutPromise to settle
                            return Promise.race([checkPromise, timeoutPromise]);
                        };
                        
                        // Wait for the email to be verified
                                try {
                                    await checkEmailVerified();

                                    try {
                                        let data = {   
                                            userId,
                                            role,
                                            firstName,
                                            LastName,
                                            email,
                                            phone,
                                            address: {
                                                street,
                                                city,
                                                state,
                                                postalCode,
                                            },
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
                                            const errorData = await response.json();
                                            alert(`Error: ${errorData.message}`);
                                        } else {
                                            router.push('/Home');
                                        }
                                    } catch (error) {
                                        console.error("Failed to create user", error);
                                        deleteUser(auth.currentUser);
                                        event.preventDefault();
                                        location.reload();
                                        return;
                                    }
                                } catch (error) {   
                                    await deleteUser(auth.currentUser);
                                    event.preventDefault();
                                    location.reload();
                                    alert('SignUp Unsuccessful (email verification timeout)');
                                }
                           
                    } catch (error) {
                            console.error("verification Failed:", error);
                            alert("Failed to send verification email: " + error.message);
                            deleteUser(auth.currentUser);
                            event.preventDefault();
                            return;
                    }
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

    const totalSteps = 2;

    const renderStep = () => { 
        switch (currentStep) {
            case 1:
                return (
                    <div>
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
                            <div className="w-1/2 pr-2">
                                <label className="block text-sm text-black font-semibold mb-2">Email</label>
                                <input 
                                type="email"
                                required
                                disabled={role === ""}
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
                    </div>
                ); 
                case 2:
                    if(role === "buyer") { 
                            return (
                                <div>
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
                                        
                                            <label className="block text-sm text-black font-semibold mb-2">PHONE</label>
                                            <input 
                                            type="tel" 
                                            required
                                            disabled={role === ""}
                                            pattern="[0-9]{10}"
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full p-2 border text-black border-black rounded-md"/>
                                        </div>
                                    </div>
                                    <div className="mb-4 w-full">
                                        
                                        <label className="block text-sm text-black font-semibold mb-2">ADDRESS</label>
                                        <div className="mb-4 w-full">
                                            <div className="w-1/2 pr-2">
                                                <label className="block text-sm text-black font-semibold mb-2">Street</label>
                                                <input 
                                                type="text" 
                                                required
                                                disabled={role === ""}
                                                onChange={(e) => setStreet(e.target.value)}
                                                className="w-full p-2 border text-black border-black rounded-md"/>
                                            </div>
                                            <div className="w-1/2 pl-2">
                                                <label className="block text-sm text-black font-semibold mb-2">City</label>
                                                <input 
                                                type="text" 
                                                required
                                                disabled={role === ""}
                                                onChange={(e) => setCity(e.target.value)}
                                                className="w-full p-2 border text-black border-black rounded-md"/>
                                            </div>
                                            <div className="w-1/2 pr-2">
                                                <label className="block text-sm text-black font-semibold mb-2">State</label>
                                                <input 
                                                type="text" 
                                                required
                                                disabled={role === ""}
                                                onChange={(e) => setState(e.target.value)}
                                                className="w-full p-2 border text-black border-black rounded-md"/>
                                            <div className="w-1/2 pl-2">
                                                <label className="block text-sm text-black font-semibold mb-2">Postal Code</label>
                                                <input 
                                                type="text" 
                                                required
                                                disabled={role === ""}
                                                onChange={(e) => setPostalCode(e.target.value)}
                                                className="w-full p-2 border text-black border-black rounded-md"/>
                                            </div>
                                        </div>
                                    </div>  
                                </div>
                            </div>
                        );
                    }
                    else if(role === "seller") {
                        return (
                            <div>
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
                                    
                                        <label className="block text-sm text-black font-semibold mb-2">COMPANY PHONE</label>
                                        <input 
                                        type="tel" 
                                        required
                                        disabled={role === ""}
                                        pattern="[0-9]{10}"
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full p-2 border text-black border-black rounded-md"/>
                                    </div>
                                </div>
                                <div className="mb-4 w-full">
                                    <label className="block text-sm text-black font-semibold mb-2">COMPANY ADDRESS</label>
                                    <div className="mb-4 w-full">
                                        <div className="w-1/2 pr-2">
                                            <label className="block text-sm text-black font-semibold mb-2">Street</label>
                                            <input 
                                            type="text" 
                                            required
                                            disabled={role === ""}
                                            onChange={(e) => setStreet(e.target.value)}
                                            className="w-full p-2 border text-black border-black rounded-md"/>
                                        </div>
                                        <div className="w-1/2 pl-2">
                                            <label className="block text-sm text-black font-semibold mb-2">City</label>
                                            <input 
                                            type="text" 
                                            required
                                            disabled={role === ""}
                                            onChang = {(e) => setCity(e.target.value)}
                                            className="w-full p-2 border text-black border-black rounded-md"/>
                                        </div>
                                        <div className="w-1/2 pr-2">
                                            <label className="block text-sm text-black font-semibold mb-2">State</label>
                                            <input 
                                            type="text" 
                                            required
                                            disabled={role === ""}
                                            onChange={(e) => setState(e.target.value)}
                                            className="w-full p-2 border text-black border-black rounded-md"/>
                                        <div className="w-1/2 pl-2">
                                            <label className="block text-sm text-black font-semibold mb-2">Postal Code</label>
                                            <input 
                                            type="text" 
                                            required
                                            disabled={role === ""}
                                            onChange={(e) => setPostalCode(e.target.value)}
                                            className="w-full p-2 border text-black border-black rounded-md"/>
                                        </div>
                                    </div>
                                </div>
                            </div> 
                        </div>
                    );
                }
            default:
                return null;
        }
    };

        const handleNext = () => {
            if (validateStep()) {
              setCurrentStep((prevStep) => prevStep + 1);
            } else {
              alert('Please fill all required fields correctly');
            }
          };
        
          const handlePrevious = () => {
            setCurrentStep((prevStep) => prevStep - 1);
          };
        
            const validateStep = () => {
                switch (currentStep) {
                    case 1:
                        return role !== "" && email !== "" && password !== "" && confirmPassword !== "";
                    case 2:
                        if(role === "buyer") {
                            return firstName !== "" && LastName !== "" && phone !== "" && street !== "" && city !== "" && state !== "" && postalCode !== "";
                        } else if(role === "seller") {
                            return firstName !== "" && LastName !== "" && phone !== "" && street !== "" && city !== "" && state !== "" && postalCode !== "";
                        }
                        default:
                            return false;
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
        

            <form onSubmit={handleSubmit}>
            {renderStep()}
            <div className="flex justify-between mt-4">
                {currentStep > 1 && (
                <button
                    type="button"
                    onClick={handlePrevious}
                    className="p-2 bg-gray-300 text-black rounded-md"
                >
                    Previous
                </button>
                )}
                {currentStep < totalSteps ? (
                <button
                    type="button"
                    onClick={handleNext}
                    className="p-2 bg-black text-white rounded-md"
                >
                    Next
                </button>
                ) : (
                <button  type="submit" className="p-2 bg-black text-white rounded-md">
                    Create Account
                </button>
                )}
            </div>
            </form>
                <Link href="/Login" className="mt-4  text-black text-xl"> 
                    <span>Already Have An Account ? Login Then</span>
                </Link>
            </div>
        </div>
    );
}
