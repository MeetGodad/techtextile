// References : ShipEngine API
// References : GitHub CoPilot
  
export async function shippingRates(sellerAddress, buyerAddress, packages) {
  const shipment = {
    ship_from: {
      name: "Seller Name",
      phone: sellerAddress.phone || "1234567890",
      address_line1: sellerAddress.street,
      city_locality: sellerAddress.city,
      state_province: sellerAddress.state,
      postal_code: sellerAddress.zipCode,
      country_code: sellerAddress.country,
      address_residential_indicator: "no"
    },
    ship_to: {
      name: "Buyer Name",
      phone: buyerAddress.phone || "0987654321",
      address_line1: buyerAddress.street,
      city_locality: buyerAddress.city,
      state_province: buyerAddress.state,
      postal_code: buyerAddress.zipCode,
      country_code: buyerAddress.country,
      address_residential_indicator: "yes"
    },
    packages: packages.map(pkg => ({
      weight: {
        value: pkg.weight,
        unit: "kilogram"
      },
      dimensions: {
        length: pkg.length || 12,
        width: pkg.width || 12,
        height: pkg.height || 12,
        unit: "inch"
      }
    })),
    preferred_currency: 'cad',
  };

  try {
    const response = await fetch('https://api.shipengine.com/v1/rates', {
      cache: 'no-store', 
      method: 'POST',
      headers: {
        'API-Key': process.env.NEXT_PUBLIC_SHIPENGINE_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rate_options: {
          carrier_ids: ['se-346919'], 
          preferred_currency: 'cad',
        },
        shipment: shipment,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('ShipEngine API error response:', errorBody);
      throw new Error(`ShipEngine API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching shipping rates:', error);
    return { error: error.message };
  }
}

