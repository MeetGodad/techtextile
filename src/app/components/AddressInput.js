// This component is used to get the address details from the user using the Google Maps Autocomplete API.
// Reference: https://react-google-maps-api-docs.netlify.app/#autocomplete
// Reference: https://developers.google.com/maps/documentation/javascript/places-autocompleteimport 
// References  : GitHub Copilot

import { useEffect, useRef, useState } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

const AddressInput = ({ 
  supportedCountries,
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
  setCountryCode
  setCountryCode
}) => {
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);
  const SUPPORTED_COUNTRIES = supportedCountries;
  const [error, setError] = useState('');
  const [isManualEntry, setIsManualEntry] = useState(false);
  const inputRef = useRef(null);
  const SUPPORTED_COUNTRIES = supportedCountries;
  const [error, setError] = useState('');
  const [isManualEntry, setIsManualEntry] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
    version: "weekly",
    useJsApiLoader: true,
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
      setError("Note: Please select an address from the dropdown list after typing at least 3 characters. We don't support manual address entry at this time");
      setIsManualEntry(true);
      return;
    }

    setIsManualEntry(false);
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
      setError("Note: Please select an address from the dropdown list after typing at least 3 characters. We don't support manual address entry at this time");
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
      setError("Note: Please select an address from the dropdown list. We don't support manual address entry at this time");
    }
  };

  const handleManualInput = (e) => {
    setStreet(e.target.value);
    if (e.target.value.length > 10) {
      setIsManualEntry(false);
    } else {
      setIsManualEntry(true);
      setError("Note: Please select an address from the dropdown list. We don't support manual address entry at this time");
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      {(error || isManualEntry) && <div className="text-red-500">{error}</div>}
      <div className="w-full mb-4">
        <label className="block text-sm font-semibold mb-2 text-black" htmlFor="street">Street</label>
        <input 
          ref={inputRef}
          type="text" 
          required
          placeholder="Start typing your address"
          value={street}
          disabled={role === ""}
          onChange={handleManualInput}
          className="w-full p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>
      {(error || isManualEntry) && <div className="text-red-500">{error}</div>}
      <div className="w-full mb-4">
        <label className="block text-sm font-semibold mb-2 text-black" htmlFor="street">Street</label>
        <input 
          ref={inputRef}
          type="text" 
          required
          placeholder="Start typing your address"
          value={street}
          disabled={role === ""}
          onChange={handleManualInput}
          className="w-full p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>
      <div className="flex flex-wrap mb-4">
        <div className="w-1/2 pr-2">
          <label className="block text-sm font-semibold mb-2 text-black" htmlFor="city">City</label>
          <input 
            type="text" 
            required
            value={city}
            disabled={role === "" || !isManualEntry}
            readOnly
            disabled={role === "" || !isManualEntry}
            readOnly
            className="w-full p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <div className="w-1/2 pl-2">
          <label className="block text-sm font-semibold mb-2 text-black" htmlFor="state">State</label>
          <input 
            type="text" 
            required
            value={state}
            disabled={role === "" || !isManualEntry}
            readOnly
            disabled={role === "" || !isManualEntry}
            readOnly
            className="w-full p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex flex-wrap mb-4">
        <div className="w-1/2 pr-2">
          <label className="block text-sm font-semibold mb-2 text-black" htmlFor="postal-code">Postal Code</label>
          <input 
            type="text" 
            required
            value={postalCode}
            disabled={role === "" || !isManualEntry}
            readOnly
            disabled={role === "" || !isManualEntry}
            readOnly
            className="w-full p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <div className="w-1/2 pl-2">
          <label className="block text-sm font-semibold mb-2 text-black" htmlFor="country">Country</label>
          <input 
            type="text" 
            required
            value={country}
            disabled={role === "" || !isManualEntry}
            readOnly
            disabled={role === "" || !isManualEntry}
            readOnly
            className="w-full p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressInput;