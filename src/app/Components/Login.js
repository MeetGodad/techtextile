export default function Login() {
  return (
    <div className="flex h-screen">
      <div className="relative flex-col flex items-center justify-center w-1/2 bg-white">
        <div className="absolute top-0 right-6 text-5xl font-semibold mb-8">LOG</div>

        <div className="w-full max-w-md">
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">INTERESTED AS</label>
            <select className="w-full p-2 border border-black rounded-md">
              <option value="">Select an option</option>
              <option value="buyer">As a Buyer</option>
              <option value="seller">As a Seller</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">EMAIL</label>
            <input type="email" className="w-full p-2 border border-black rounded-md"/>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">PASSWORD</label>
            <input type="password" className="w-full p-2 border border-black rounded-md" />
          </div>

          <button className="w-full p-4 bg-black text-white rounded-md font-semibold text-xl">
            CONTINUE
          </button>
        </div>

        <a className="mt-4 text-xl" href="#">Don’t have an account?</a>
      </div>

      <div className="flex items-center justify-center w-1/2 bg-black relative">
        <div className="top-0 text-5xl font-semibold text-white absolute left-7">IN</div>
        <img src="Images/LOGO.png" alt="Logo" className="w-3/4 h-auto" />
      </div>
    </div>
  );
}
