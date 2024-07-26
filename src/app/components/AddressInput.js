import { useEffect, useRef, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];

const AddressInput = ({ 
  supportedCountries,
  role, 
  street, 
  city, 
  state, 
  postalCode,
  country,
  setStreet, 
  setCity, 
  setState, 
  setPostalCode, 
  setStateCode, 
  setCountryCode,
}) => {
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);
  const SUPPORTED_COUNTRIES = supportedCountries;
  const [error, setError] = useState('');
  const [isManualEntry, setIsManualEntry] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
    version: 'weekly',
  });

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      const autocompleteInstance = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: SUPPORTED_COUNTRIES },
      });
      autocompleteRef.current = autocompleteInstance;
      autocompleteInstance.addListener('place_changed', handlePlaceSelect);
    }
  }, [isLoaded]);

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (!place || !place.address_components) {
      setError("Please select an address from the dropdown list after typing at least 3 characters. Manual address entry is not supported.");
      setIsManualEntry(true);
      return;
    }

    setIsManualEntry(false);

    let newStreet = '', newCity = '', newState = '', newStateCode = '', newPostalCode = '', newCountry = '', newCountryCode = '';
  
    for (const component of place.address_components) {
      const componentType = component.types[0];
      switch (componentType) {
        case 'street_number':
          newStreet = component.long_name + ' ' + newStreet;
          break;
        case 'route':
          newStreet += component.long_name;
          break;
        case 'sublocality_level_1':
        case 'sublocality_level_2':
        case 'sublocality_level_3':
          if (!newStreet) {
            newStreet = component.long_name;
          } else {
            newStreet += ', ' + component.long_name;
          }
          break;
        case 'locality':
          newCity = component.long_name;
          break;
        case 'administrative_area_level_1':
          newState = component.long_name;
          newStateCode = component.short_name;
          break;
        case 'postal_code':
          newPostalCode = component.long_name;
          break;
        case 'country':
          newCountry = component.long_name;
          newCountryCode = component.short_name;
          break;
      }
    }
  
    if (!newStreet) {
      newStreet = place.formatted_address.split(',')[0];
    }

    // Check if the country is supported
    if (!SUPPORTED_COUNTRIES.includes(newCountryCode)) {
      setError(`We do not support addresses in ${newCountry}.`);
      return;
    }

    setError('');
    setStreet(newStreet);
    setCity(newCity);
    setState(newState);
    setPostalCode(newPostalCode);
    setStateCode(newStateCode);
    setCountryCode(newCountryCode);
  };

  const handleManualInput = (e) => {
    setStreet(e.target.value);
    if (e.target.value.length > 10) {
      setIsManualEntry(false);
    } else {
      setIsManualEntry(true);
      setError("Please select an address from the dropdown list. Manual address entry is not supported.");
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      {(error || isManualEntry) && <div className="text-red-500">{error}</div>}
      <div className="w-full mb-4 relative group">
        <input 
          ref={inputRef}
          type="text" 
          required
          placeholder=" "
          value={street}
          disabled={role === ""}
          onChange={handleManualInput}
          className="peer w-full p-4 pl-12 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 group-hover:bg-white placeholder-transparent"
        />
        <label className="absolute left-12 top-4 text-gray-500 transition-all duration-300 peer-focus:text-sm peer-focus:-top-2 peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 peer-focus:-ml-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-blue-500 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:-ml-1">
          Street
        </label>
        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 peer-focus:text-blue-500 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="flex flex-wrap mb-4">
        <div className="w-1/2 pr-2 relative group">
          <input 
            type="text" 
            required
            placeholder=" "
            value={city}
            disabled={role === "" || !isManualEntry}
            readOnly
            className="peer w-full p-4 pl-12 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 group-hover:bg-white placeholder-transparent"
          />
          <label className="absolute left-12 top-4 text-gray-500 transition-all duration-300 peer-focus:text-sm peer-focus:-top-2 peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 peer-focus:-ml-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-blue-500 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:-ml-1">
            City
          </label>
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 peer-focus:text-blue-500 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="w-1/2 pl-2 relative group">
          <input 
            type="text" 
            required
            placeholder=" "
            value={state}
            disabled={role === "" || !isManualEntry}
            readOnly
            className="peer w-full p-4 pl-12 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 group-hover:bg-white placeholder-transparent"
          />
          <label className="absolute left-12 top-4 text-gray-500 transition-all duration-300 peer-focus:text-sm peer-focus:-top-2 peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 peer-focus:-ml-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-blue-500 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:-ml-1">
            State
          </label>
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 peer-focus:text-blue-500 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className="flex flex-wrap mb-4">
        <div className="w-1/2 pr-2 relative group">
          <input 
            type="text" 
            required
            placeholder=" "
            value={postalCode}
            disabled={role === "" || !isManualEntry}
            readOnly
            className="peer w-full p-4 pl-12 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 group-hover:bg-white placeholder-transparent"
          />
          <label className="absolute left-12 top-4 text-gray-500 transition-all duration-300 peer-focus:text-sm peer-focus:-top-2 peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 peer-focus:-ml-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-blue-500 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:-ml-1">
            Postal Code
          </label>
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 peer-focus:text-blue-500 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
            <path fillRule="evenodd" d="M5 2a1 1 0 011-1h8a1 1 0 011 1v10a1 1 0 01-1 1H6a1 1 0 01-1-1V2zm2 1h4v8H7V3zm8 0h2v8h-2V3zM7 14a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="w-1/2 pl-2 relative group">
          <input 
            type="text" 
            required
            placeholder=" "
            value={country}
            disabled={role === "" || !isManualEntry}
            readOnly
            className="peer w-full p-4 pl-12 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 group-hover:bg-white placeholder-transparent"
          />
          <label className="absolute left-12 top-4 text-gray-500 transition-all duration-300 peer-focus:text-sm peer-focus:-top-2 peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 peer-focus:-ml-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-blue-500 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:-ml-1">
            Country
          </label>
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 peer-focus:text-blue-500 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AddressInput;