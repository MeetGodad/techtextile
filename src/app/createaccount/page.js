
import RegistrationForm from "../Components/registrationForm";

export default function CreateAccount () {
    return (
        <div className="flex flex-col  h-screen text-black  justify-center w-2/4 border-white  bg-white">
            <div ><h1 className="flex justify-center font-extrabold mb-4">Create Account</h1>
            <div className="ml-20 mr-20 mt-4"><RegistrationForm></RegistrationForm></div>
            <button><div>Create Account</div></button>
            </div>
            
        </div>
        
    )
}