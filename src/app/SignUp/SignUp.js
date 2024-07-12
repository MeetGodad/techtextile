"use client";
import Link from 'next/link';
import { useState , useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth} from '../auth/auth-context';
import { auth } from '../auth/firebase';
import { sendEmailVerification , deleteUser , reload} from 'firebase/auth';
import Swal from 'sweetalert2';
import AddressInput from '../components/AddressInput';

export default function SignUp() {

    const { emailSignUp} = useUserAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [totalSteps, setTotalSteps] = useState(2); // adjust this value based on your total steps
    const [slideDirection, setSlideDirection] = useState(''); // add this state to track slide direction
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
    const [country , setCountry] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const user = useUserAuth();
    const router = useRouter();


    useEffect(() => {
        // This will call validatePassword every time password or confirmPassword changes
        validatePassword();
      }, [confirmPassword]); // Add other dependencies if necessary
      

    const handleSubmit = async (event) => {
            event.preventDefault();



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
                        Swal.fire({
                            title: 'Verification Email Sent',
                            text: 'Please verify your email to complete the sign up process',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });
                
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
                                                country,
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
                                            Swal.fire({
                                                title: 'DataBase Error',
                                                text: errorData.message,
                                                icon: 'error',
                                                confirmButtonText: 'OK'
                                            });
                                            deleteUser(auth.currentUser);
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
                                    Swal.fire({
                                        title: 'Email verification timeout',
                                        text: 'You did not verify your email in time. Please sign up again.',
                                        icon: 'error',
                                        confirmButtonText: 'OK'
                                    });
                                }
                           
                    } catch (error) {
                            console.error("verification Failed:", error);
                            Swal.fire({
                                title: 'Failed to send verification email',
                                text: 'Please sign up again with a valid email address.',
                                icon: 'error',
                                confirmButtonText: 'OK'
                            });
                            deleteUser(auth.currentUser);
                            event.preventDefault();
                            return;
                    }
                }

            } catch (error) {
                if (error.code === "auth/email-already-in-use") {
                   Swal.fire({
                        title: 'Email already in use',
                        text: 'Please sign up with a different email address.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                } else {
                console.error("Failed to sign up:", error);
                deleteUser(auth.currentUser);
                event.preventDefault();
                location.reload();
                Swal.fire({
                    title: 'Failed to sign up',
                    text: 'Please sign up again with correct Credentials Something Went Unexpected .',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    };
    

    const renderStep = () => { 
        switch (currentStep) {
            case 1:
                return (
                    <div>
                         <div className="flex flex-col mb-4">
                            <label className="block text-sm font-semibold mb-2 text-black" for="interested-as">INTERESTED AS</label>
                            <select 
                            required
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent">
                            <option className='justify-self-start' value="">Select an option</option>
                            <option value="buyer">As a Buyer</option>
                            <option value="seller">As a Business Partner</option>
                            </select>
                        </div>
                        <div className="flex flex-col mb-4">
                            <label className="block text-sm font-semibold mb-2 text-black" for="email">Email</label>
                            <input 
                            type="email"
                            required
                            value={email}
                            disabled={role === ""}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" />
                        </div>
                        <div className="flex flex-col mb-4">
                            <label className="block text-sm font-semibold mb-2 text-black" for="password">Password</label>
                            <input 
                            type="password" 
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            value={password}
                            disabled={role === ""}
                            className="w-full p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2  focus:ring-black focus:border-transparent" />
                        </div>
                        <div className="flex flex-col mb-4">
                            <label className="block text-sm font-semibold mb-2 text-black" for="confirm-password">Confirm Password </label>
                            <input 
                            type="password" 
                            required
                            value={confirmPassword}
                            disabled={role === ""}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                validatePassword(); // This assumes validatePassword will now correctly set passwordError based on the current and confirm passwords
                              }}
                            className="w-full m-1 p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2  focus:ring-black focus:border-transparent" />
                            {passwordError && <p className="text-red-500 text-sm">Passwords do not match</p>}
                        </div>
                    </div>
                ); 
                case 2:
                    if(role === "buyer") { 
                            return (
                                <div>
                                   <div className="flex flex-wrap mb-4">
                                    <div className="w-1/2 pr-2">
                                    <label className="block text-sm font-semibold mb-2 text-black" for="first-name">First Name</label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                        value={firstName}
                                        disabled={role === ""}
                                        className="w-full p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" />
                                    </div>
                                    <div className="w-1/2 pl-2">
                                    <label className="block text-sm font-semibold mb-2 text-black" for="last-name">Last Name</label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                        value={LastName}
                                        disabled={role === ""}
                                        className="w-full p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap mb-4">
                                    <div className="w-1/2 pr-2">
                                    <label className="block text-sm font-semibold mb-2 text-black" for="phone">PHONE</label>
                                    <input 
                                        type="tel" 
                                        required
                                        value={phone}
                                        disabled={role === ""}
                                        pattern="[0-9]{10}"
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold mb-2 text-black" for="address">ADDRESS</label>
                                    <AddressInput
                                        supportedCountries={['CA']}
                                        role={role}
                                        street={street}
                                        city={city}
                                        state={state}
                                        postalCode={postalCode}
                                        country={country}
                                        setStreet={setStreet}
                                        setCity={setCity}
                                        setState={setState}
                                        setPostalCode={setPostalCode}
                                        setStateCode={setState}
                                        setCountryCode={setCountry}
                                    />
                                </div>
                            </div>
                        );
                    }
                    else if(role === "seller") {
                        return (
                            <div>
                               <div className="flex flex-wrap mb-4">
                                <div className="w-1/2 pr-2">
                                <label className="block text-sm font-semibold mb-2 text-black" for="first-name">First Name</label>
                                <input 
                                    type="text" 
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    disabled={role === ""}
                                    className="w-full p-2 pl-10 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" />
                                </div>
                                <div className="w-1/2 pr-2">
                                <label className="block text-sm font-semibold mb-2 text-black" for="last-name">Last Name</label>
                                <input 
                                    type="text" 
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    disabled={role === ""}
                                    className="w-full p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" />
                                </div>
                            </div>
                            <div className="flex flex-wrap mb-4">
                                <div className="w-1/2 pr-2">
                                <label className="block text-sm font-semibold mb-2 text-black" for="company-phone">Company Phone</label>
                                <input 
                                    type="tel" 
                                    required
                                    disabled={role === ""}
                                    pattern="[0-9]{10}"
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" />
                                </div>
                                <div className="w-1/2 pr-2">
                                    <label className="block text-sm font-semibold mb-2 text-black" for="company-name">Company Name</label>
                                    <input 
                                    type="text" 
                                    required
                                    disabled={role === ""}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="w-full p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2 text-black" for="company-address">Company Address</label>
                                <AddressInput
                                        supportedCountries={['CA' , 'IN']}
                                        role={role}
                                        street={street}
                                        city={city}
                                        state={state}
                                        postalCode={postalCode}
                                        country={country}
                                        setStreet={setStreet}
                                        setCity={setCity}
                                        setState={setState}
                                        setPostalCode={setPostalCode}
                                        setStateCode={setState}
                                        setCountryCode={setCountry}
                                    />
                            </div>              
                        </div>
                    );
                }
            default:
                return null;
        }
    };



    const validatePassword = () => {
        if (password === confirmPassword) {
          // Assuming passwordError is a boolean
          setPasswordError(false); // Or use an empty string if it's a string state
          return true;
        } else {
          // Set to true or a descriptive error message
          setPasswordError(true);     
          return false;  
        }
      };

    const validateStep = () => {

            if (!validatePassword()) {
                // If password validation fails, stop further validation and show the password error
                return false;
            }


                switch (currentStep) {
                    case 1:
                        return role !== "" && email !== "" && password !== "" && confirmPassword !== "";
                    case 2:
                        if(role === "buyer") {
                            return firstName !== "" && LastName !== "" && phone !== "" && street !== "" && city !== "" && state !== "" && postalCode !== "";
                        } else if(role === "seller") {
                            return firstName !== "" && LastName !== "" && phone !== "" && street !== "" && city !== "" && state !== "" && postalCode !== "" ;
                        }
                        default:
                            return false;    
                }
        }

    const handleNext = () => {

        if (validateStep()) {
          setSlideDirection('translate-x-full opacity-0'); // set slide direction to right
          setTimeout(() => {
            setCurrentStep((prevStep) => prevStep + 1);
            setSlideDirection('translate-x-0 opacity-100'); // set slide direction to left after animation
          }, 500); // adjust the timeout value based on your animation duration
        } else {
             Swal.fire({
                title: 'Error',
                text: 'Please fill in all the required fields' ,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
      };
    
      const handlePrevious = () => {
        setSlideDirection('-translate-x-full opacity-0'); // set slide direction to left
        setTimeout(() => {
          setCurrentStep((prevStep) => prevStep - 1);
          setSlideDirection('translate-x-0 opacity-100'); // set slide direction to right after animation
        }, 500); // adjust the timeout value based on your animation duration
      };

     

        
        
  
    
    return (
        <div className="flex h-screen">
            <div className="flex items-center justify-center w-1/2 bg-black relative">
                <div className="top-0 text-5xl font-semibold text-white absolute right-3">SIGN</div>
                <img src="Images/LOGO.png" alt="Logo" className="w-3/4 h-auto" />
            </div>
            <div className="relative flex flex-col items-center justify-center w-1/2 bg-white">
                <div className="absolute top-0 left-3 text-5xl text-black font-semibold mb-8">UP</div>
        

                <form
                    onSubmit={handleSubmit}
                    className={`max-w-2xl mx-auto p-8 pt-12 bg-white rounded-md shadow-2xl w-96 transition duration-500 ease-in-out ${slideDirection}`}>
                    <div>
                        {renderStep()}
                    </div>
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
                            className="p-2 justify-center justify-self-center bg-black text-white rounded-md"
                        >
                            Next
                        </button>
                        ) : (
                        <button type="submit" className="p-2 bg-black text-white rounded-md">
                            Create Account
                        </button>
                        )}
                    </div>
                    </form>
                    <div className="absolute bottom-14 left-0 w-full text-center mb-4">
                        <Link href="/Login" className="text-black text-2xl">
                            <span>Already Have An Account? Login Then</span>
                        </Link>
                    </div>
            </div>
        </div>
    );
}
