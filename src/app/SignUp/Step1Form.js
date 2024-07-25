// components/Step1Form.js
"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export function Step1Form({
  formData,
  handleChange,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  requirements,
  passwordError
}) {
  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-lg transition-opacity duration-500 ease-in-out">
      <div className="flex flex-col mb-6">
        <label className="block text-sm font-semibold mb-2 text-gray-700" htmlFor="role">
          INTERESTED AS
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-3 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        >
          <option value="">Select an option</option>
          <option value="buyer">As a Buyer</option>
          <option value="seller">As a Business Partner</option>
        </select>
      </div>

      <div className="flex flex-col mb-6">
        <label className="block text-sm font-semibold mb-2 text-gray-700" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={formData.role === ""}
          className="w-full p-3 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>
      
      <div className="flex flex-col mb-6 relative">
        <label className="block text-sm font-semibold mb-2 text-gray-700" htmlFor="password">
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          disabled={formData.role === ""}
          className="w-full p-3 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
        <button
          type="button"
          className="absolute right-3 top-10 text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </button>
      </div>

      <div className="flex flex-col mb-6 relative">
        <label className="block text-sm font-semibold mb-2 text-gray-700" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={formData.role === ""}
          className="w-full p-3 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
        <button
          type="button"
          className="absolute right-3 top-10 text-gray-500"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
        </button>
      </div>

      <div className="mt-6">
        <ul className="space-y-1">
          {Object.entries(requirements).map(([key, value]) => (
            <li key={key} className={`text-sm ${value ? 'text-green-500' : 'text-red-500'}`}>
              {key === 'length' ? 'At least 8 characters long' :
               key === 'uppercase' ? 'Contains an uppercase letter' :
               key === 'lowercase' ? 'Contains a lowercase letter' :
               key === 'number' ? 'Contains a number' :
               key === 'special' ? 'Contains a special character' :
               key === 'match' ? 'Passwords match' :
               key.charAt(0).toUpperCase() + key.slice(1)}
            </li>
          ))}
        </ul>
        {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
      </div>
    </div>
  );
}