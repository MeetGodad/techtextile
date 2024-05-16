export default function RegistrationForm () {
    return (<div className="grid grid-cols-2 gap-8  space-y-4 mb-8">
        <div className="flex flex-col mb-2">
          <label className="mb-2 font-semibold">First Name</label>
          <input type="text" className="text-black border p-2 rounded" />
        </div>
        <div className="flex flex-col mb-2">
          <label className="mb-2 font-semibold">Last Name</label>
          <input type="text" className="text-black border p-2 rounded" />
        </div>
        <div className="flex flex-col mb-2">
          <label className="mb-2 font-semibold">Email</label>
          <input type="email" className="border text-black p-2 rounded" />
        </div>
        <div className="flex flex-col mb-2">
          <label className="mb-2 font-semibold">Date Of Birth</label>
          <input type="Date" className="border text-black p-2 rounded" />
        </div>
        <div className="flex flex-col mb-2">
          <label className="mb-2 font-semibold">Password</label>
          <input type="password" className="border text-black p-2 rounded" />
        </div>
        <div className="flex flex-col mb-2">
          <label className="mb-2 font-semibold">Confirm Password</label>
          <input type="password" className="border text-black p-2 rounded" />
        </div>
        </div>
    )
}