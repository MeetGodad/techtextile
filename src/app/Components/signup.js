import Link from 'next/link';

export default function SignUp() {
    return (
        <div className="flex h-screen">
            <div className="flex items-center justify-center w-1/2 bg-black relative">
                <div className="top-0 text-5xl font-semibold text-white absolute right-3">SIGN</div>
                <img src="Images/LOGO.png" alt="Logo" className="w-3/4 h-auto" />
            </div>
            <div className="relative flex flex-col items-center justify-center w-1/2 bg-white">
                <div className="absolute top-0 left-3 text-5xl font-semibold mb-8">UP</div>
        
                <div className="w-full max-w-md">
                    <div className="flex flex-col items-center mb-4">
                        <div className="flex mb-4 w-full">
                            <div className="w-1/2 pr-2">
                                <label className="block text-sm font-semibold mb-2">NAME</label>
                                <input type="email" className="w-full p-2 border border-black rounded-md"/>
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-sm font-semibold mb-2">PASSWORD</label>
                                <input type="password" className="w-full p-2 border border-black rounded-md" />
                            </div>
                        </div>
                        <div className="flex mb-4 w-full">
                            <div className="w-1/2 pr-2">
                                <label className="block text-sm font-semibold mb-2">EMAIL</label>
                                <input type="text" className="w-full p-2 border border-black rounded-md"/>
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-sm font-semibold mb-2">CONFIRM PASSWORD</label>
                                <input type="password" className="w-full p-2 border border-black rounded-md" />
                            </div>
                        </div>
                        <div className="flex mb-4 w-full">
                            <div className="w-1/2 pr-2">
                                <label className="block text-sm font-semibold mb-2">PHONE</label>
                                <input type="text" className="w-full p-2 border border-black rounded-md"/>
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-sm font-semibold mb-2">COMPANY NAME</label>
                                <input type="password" className="w-full p-2 border border-black rounded-md" />
                            </div>
                        </div>
                        <div className="w-1/2 pr-2 mb-5">
                            <label className="block text-sm font-semibold mb-2">PHONE</label>
                            <input type="text" className="w-full p-2 border border-black rounded-md"/>
                        </div>
                        <button className="w-96 p-4 bg-black text-white rounded-md font-semibold text-xl">
                            CONTINUE
                        </button>
                    </div>
                </div>
        
                <Link href="./Components/signup.js" className="mt-4 text-xl">Don’t have an account?</Link>
            </div>
        </div>
    );
}
