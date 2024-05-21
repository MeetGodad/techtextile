export default function SignUp() {
    return (
      <div className="flex w-full h-full">
        <div className="flex w-2/4 relative bg-black h-[1024px] overflow-hidden text-left text-white font-poppins">
          <div className="absolute top-[150px] left-[10px] text-16xl tracking-[-0.02em] leading-[140%] font-semibold text-white text-[3rem]">
            <span>TT</span>
          </div>
        </div>
        <div className="flex w-2/4 relative bg-white h-[1024px] overflow-hidden text-left text-black font-poppins">
          <form className="absolute top-[150px] left-[10%] w-4/5">
            <h2 className="text-4xl font-bold mb-6">SIGN UP</h2>
            <div className="mb-4">
              <input
                className="w-full p-3 border border-gray-300 rounded-lg"
                type="text"
                placeholder="Name"
              />
            </div>
            <div className="mb-4">
              <input
                className="w-full p-3 border border-gray-300 rounded-lg"
                type="email"
                placeholder="Email"
              />
            </div>
            <div className="mb-4">
              <input
                className="w-full p-3 border border-gray-300 rounded-lg"
                type="text"
                placeholder="Phone"
              />
            </div>
            <div className="mb-4">
              <input
                className="w-full p-3 border border-gray-300 rounded-lg"
                type="password"
                placeholder="Password"
              />
            </div>
            <div className="mb-4">
              <input
                className="w-full p-3 border border-gray-300 rounded-lg"
                type="password"
                placeholder="Confirm Password"
              />
            </div>
            <div className="mb-4">
              <input
                className="w-full p-3 border border-gray-300 rounded-lg"
                type="text"
                placeholder="Company Name"
              />
            </div>
            <div className="mb-4">
              <input
                className="w-full p-3 border border-gray-300 rounded-lg"
                type="text"
                placeholder="Company Address"
              />
            </div>
            <div className="flex items-center mb-4">
              <input type="checkbox" id="agree" className="mr-2" />
              <label htmlFor="agree" className="text-gray-700">
                I agree to all the Terms and privacy policy
              </label>
            </div>
            <button className="w-full bg-black text-white py-3 rounded-lg font-semibold">
              SIGN UP
            </button>
            <p className="mt-4 text-center text-gray-700">
              Already have an account?
            </p>
          </form>
        </div>
      </div>
    );
  }
  