// This component is used to get the address details from the user using the Google Maps Autocomplete API.
// Reference: https://react-google-maps-api-docs.netlify.app/#autocomplete
// Reference: https://developers.google.com/maps/documentation/javascript/places-autocomplete
// Reference : Perplexity AI


import React, { useRef } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];
const SUPPORTED_COUNTRIES = ['IN', 'CA']; // Add the country codes you want to support

const AddressInput = ({ 
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
}) => {
  const autocompleteRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
    version: "weekly",
    useJsApiLoader: true,
  });

  const handlePlaceSelect = (place) => {
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
  
    setStreet(newStreet);
    setCity(newCity);
    setState(newState);
    setPostalCode(newPostalCode);
    setStateCode(newStateCode);
    setCountryCode(newCountryCode);
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <Autocomplete
        onLoad={(autocomplete) => {
          autocompleteRef.current = autocomplete;
          // Set the component restrictions here
          autocomplete.setComponentRestrictions({ country: SUPPORTED_COUNTRIES });
        }}
        onPlaceChanged={() => {
          const place = autocompleteRef.current.getPlace();
          handlePlaceSelect(place);
        }}
      >
        <div className="w-full mb-4">
          <label className="block text-sm font-semibold mb-2 text-black" htmlFor="street">Street</label>
          <input 
            type="text" 
            required
            placeholder="Search for your address"
            value={street}
            disabled={role === ""}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </Autocomplete>
      <div className="flex flex-wrap mb-4">
        <div className="w-1/2 pr-2">
          <label className="block text-sm font-semibold mb-2 text-black" htmlFor="city">City</label>
          <input 
            type="text" 
            required
            value={city}
            disabled={role === ""}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <div className="w-1/2 pl-2">
          <label className="block text-sm font-semibold mb-2 text-black" htmlFor="state">State</label>
          <input 
            type="text" 
            required
            value={state}
            disabled={role === ""}
            onChange={(e) => setState(e.target.value)}
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
            disabled={role === ""}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <div className="w-1/2 pl-2">
          <label className="block text-sm font-semibold mb-2 text-black" htmlFor="country">Country</label>
          <input 
            type="text" 
            required
            value={country}
            disabled={role === ""}
            onChange={(e) => setCountryCode(e.target.value)}
            className="w-full p-2 pl-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressInput;
