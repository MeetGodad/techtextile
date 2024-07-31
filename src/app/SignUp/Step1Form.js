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
    <div className="space-y-6">
      <div className="relative group">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="role">
          Interested As
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
        >
          <option value="">Select an option</option>
          <option value="buyer">As a Buyer</option>
          <option value="seller">As a Business Partner</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-5 mt-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>

      <div className="relative group">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={formData.role === ""}
          className="w-full p-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 peer placeholder-transparent"
          placeholder="Email"
        />
        <label className="absolute left-3 -top-2.5 text-sm text-gray-600 transition-all duration-300 bg-white px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
          Email
        </label>
      </div>

        <div className="relative group flex-1">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={formData.role === ""}
            className="w-full p-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 peer placeholder-transparent"
            placeholder="Password"
          />
          <label className="absolute left-3 -top-2.5 text-sm text-gray-600 transition-all duration-300 bg-white px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
            Password
          </label>
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-500 transition duration-300 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>

        <div className="relative group flex-1">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={formData.role === ""}
            className="w-full p-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 peer placeholder-transparent"
            placeholder="Confirm Password"
          />
          <label className="absolute left-3 -top-2.5 text-sm text-gray-600 transition-all duration-300 bg-white px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
            Confirm Password
          </label>
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-500 transition duration-300 hover:text-gray-700"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
          </button>
        </div>
      <div className="mt-6">
        <ul className="space-y-1">
          {Object.entries(requirements).map(([key, value]) => (
            <li key={key} className={`text-sm flex items-center ${value ? 'text-green-500' : 'text-red-500'} transition-all duration-300`}>
              <span className={`mr-2 ${value ? 'text-green-500' : 'text-red-500'}`}>
                {value ? '✓' : '✗'}
              </span>
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
        {passwordError && <p className="text-red-500 text-sm mt-2 transition-all duration-300">{passwordError}</p>}
      </div>
    </div>
  ); 
}