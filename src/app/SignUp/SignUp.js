//reference : Github Copilot
"use client";
import Link from 'next/link';
import { useState , useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth} from '../auth/auth-context';
import { auth } from '../auth/firebase';
import Swal from 'sweetalert2';
import { deleteUser , reload} from 'firebase/auth';
import { useSignUpForm } from './useSignUpForm';
import { usePasswordValidation } from './usePasswordValidation';
import { useErrorHandler } from './useErrorHandler';
import { Step1Form } from './Step1Form';
import { Step2Form } from './Step2Form';
import { EmailVerification } from './EmailVerification';


export default function SignUp( {onSwitch}) {

    const { emailSignUp} = useUserAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [totalSteps, setTotalSteps] = useState(2); // adjust this value based on your total steps
    const [slideDirection, setSlideDirection] = useState(''); // add this state to track slide direction
    const { formData, handleChange } = useSignUpForm();
    const { error, handleError } = useErrorHandler();
    const { requirements, passwordError } = usePasswordValidation(formData.password, formData.confirmPassword);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const user = useUserAuth();
    const router = useRouter();


    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!validateStep()) {
            Swal.fire({
                title: 'Error',
                text: 'Please fill in all the required fields and ensure password requirements are met',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }
    
try {
      const userId = await emailSignUp(formData.email, formData.password);

      const checkUserAvailable = async () => {
        return new Promise((resolve, reject) => {
          const intervalId = setInterval(() => {
            if (user) {
              clearInterval(intervalId);
              resolve(user);
            }
          }, 1000);

          setTimeout(() => {
            clearInterval(intervalId);
            reject(new Error('User not available'));
          }, 10000);
        });
      };

      await checkUserAvailable();

      if (user) {
        const isVerified = await EmailVerification(user, auth);

        if (isVerified) {
          try {
            let data = {
              userId,
              role: formData.role,
              firstName: formData.firstName,
              LastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              address: {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
                country: formData.country,
              },
            };

            if (formData.role === "seller") {
              data = {
                ...data,
                companyName: formData.companyName,
              };
            }

            const response = await fetch('/api/auth', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });

            if (!response.ok) {
              const responseData = await response.json();
              await deleteUser(auth.currentUser);
              Swal.fire({
                title: 'Error',
                text: responseData.message || 'An error occurred',
                icon: 'error',
                confirmButtonText: 'OK'
              });


            } else {
              Swal.fire({
                title: 'Success',
                text: 'User created successfully',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(() => {
                router.push('/Home');
              });
            }
          } catch (error) {
            console.error("Failed to create user", error);
            await deleteUser(auth.currentUser);
            handleError("Failed to create user. Please sign up again.");
          }
        }
      } else {
        handleError("User not available. Please sign up again.");
        event.target.reset();
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        handleError("Email already in use. Please sign up with a different email address.");
      } else {
        handleError("Please sign up again with valid credentials. Something went wrong.");
      }
    }
  };
    
    
    

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div>
                        <Step1Form
                            formData={formData}
                            handleChange={handleChange}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            showConfirmPassword={showConfirmPassword}
                            setShowConfirmPassword={setShowConfirmPassword}
                            requirements={requirements}
                            passwordError={passwordError}
                        />
                    </div>
                );
            case 2:
                return (
                    <Step2Form
                        formData={formData}
                        handleChange={handleChange}
                        role={formData.role}
                    />
                );
            default:
                return null;
        }
    };

    const validateStep = () => {
        if (passwordError) {
            return false;
        }

        switch (currentStep) {
            case 1:
                return formData.role !== "" && formData.email !== "" && formData.password !== "" && formData.confirmPassword !== "";
            case 2:
                if (formData.role === "buyer" || formData.role === "seller") {
                    return formData.firstName !== "" && formData.lastName !== "" && formData.phone !== "" && 
                           formData.street !== "" && formData.city !== "" && formData.state !== "" && formData.postalCode !== "";
                }
                return false;
            default:
                return false;
        }
    }

    const handleNext = () => {
        if (validateStep()) {
          setSlideDirection('translate-x-full opacity-0');
          setTimeout(() => {
            setCurrentStep((prevStep) => prevStep + 1);
            setSlideDirection('translate-x-0 opacity-100');
          }, 500);
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Please fill in all the required fields and ensure password requirements are met',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      };
    

      const handlePrevious = () => {
        setSlideDirection('translate-x-full opacity-0');
        setTimeout(() => {
          setCurrentStep((prevStep) => prevStep - 1);
          setSlideDirection('translate-x-0 opacity-100');
        }, 500);
      };

    
   return (
    <div className="relative flex flex-col items-center justify-center max-h-screen w-full bg-gray-50 p-3">
      <div className="absolute top-4 left-4 text-3xl md:text-5xl text-black font-semibold z-10">UP</div>
  
      <div className="w-full mt-10 max-w-lg p-4">
        <form onSubmit={handleSubmit} className="w-full bg-white rounded-lg shadow-md p-4 flex flex-col justify-between min-h-[50vh]"> {/* Adjusted height */}
          <div className={`flex-grow transition-all duration-500 ease-in-out ${slideDirection}`}>
            {renderStep()}
          </div>
          <div className="mt-2 flex justify-between w-full">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevious}
                className="w-[48%] px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300 text-sm md:text-base"
              >
                Previous
              </button>
            ) : (
              <div className="w-[48%]"></div>
            )}
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition duration-300 text-sm md:text-base"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="w-[48%] px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition duration-300 text-sm md:text-base"
              >
                Create Account
              </button>
            )}
          </div>
        </form>
      </div>
  
      <div className=" flex-col w-full text-center mt-2">
        <button
          onClick={() => onSwitch('login')}
          className="text-black font-bold text-sm md:text-base hover:underline transition duration-300"
        >
          Already Have An Account? Sign In<br />
        </button>
      </div>
    </div>
  );
  
}  