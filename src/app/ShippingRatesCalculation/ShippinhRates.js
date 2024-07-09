// Perplexity AI

import { useState, useEffect } from 'react';
import { exchangeRates } from 'exchange-rates-api';

const ShippingRateCalculator = ({ cartItems, buyerAddress ,onTotalShippingCostChange }) => {
  const [shippingRates, setShippingRates] = useState({});
  const [totalShippingCost, setTotalShippingCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [hasInternationalShipping, setHasInternationalShipping] = useState(false);

  useEffect(() => {
    onTotalShippingCostChange(totalShippingCost);
  }, [totalShippingCost , onTotalShippingCostChange]);

  const CENTRAL_WAREHOUSE_ADDRESS = {
    street: 'No 4 Shubhlaxmi Bunglows',
    city: 'Surat',
    state: 'GJ',
    zipCode: '395017',
    country: 'IN',
    phone_num: '4039510992',
  };

  useEffect(() => {
    calculateShippingRates();
  }, [cartItems, buyerAddress]);

  const calculateShippingRates = async () => {
    setIsLoading(true);
    setErrors({});
    const shipmentsBySeller = groupShipmentsBySeller(cartItems);

    let totalCost = 0;
    const newShippingRates = {};
    const newErrors = {};
    let totalIndiaWeight = 0;

    // Fetch the exchange rate from INR to CAD
    let exchangeRate = 0.016;
    try {
      const rateData = await exchangeRates().latest().base('INR').symbols('CAD').fetch();
      exchangeRate = rateData.rates.CAD;
      console.log('Exchange rate:', exchangeRate);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }

    for (const [sellerId, shipment] of Object.entries(shipmentsBySeller)) {
      console.log(`Processing seller ${sellerId}:`, shipment);
      const sellerAddress = shipment.sellerAddress;
      const packages = calculatePackages(shipment.items);

      console.log('Seller Address :', sellerAddress , 'Buyer Address :', buyerAddress );

      if (sellerAddress.country === 'IN') {
        totalIndiaWeight += packages.reduce((acc, pkg) => acc + pkg.weight, 0);
        setHasInternationalShipping(true);
      } else {
        try {
          const response = await fetch('/api/fedexApi', {
            cache: 'force-cache',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
              'Expires': '0'
            },
            body: JSON.stringify({
              sellerAddress: {
                street: sellerAddress.street,
                city: sellerAddress.city,
                state: sellerAddress.state,
                zipCode: sellerAddress.postal_code,
                country: sellerAddress.country,
                phone: sellerAddress.phone_num,
              },
              buyerAddress: {
                street: buyerAddress.address,
                city: buyerAddress.city,
                state: buyerAddress.state,
                zipCode: buyerAddress.zip,
                country: buyerAddress.country,
                phone: buyerAddress.phone || '',
              },
              packages,
            }),
          });

          const rateData = await response.json();
          console.log(`ShipEngine API Response for seller ${sellerId}:`, rateData);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          if (rateData.error) {
            throw new Error(rateData.error);
          }

          if (!rateData.rate_response || !rateData.rate_response.rates || rateData.rate_response.rates.length === 0) {
            console.log(`No shipping rates available for seller ${sellerId}. Full response:`, rateData);
            throw new Error('No shipping rates available');
          }

          console.log("Response from ShipEngine API", rateData);

          const cheapestRate = findCheapestRate(rateData.rate_response.rates);
          if (cheapestRate) {
            // Convert the rate to CAD if it is in INR
            const amountInCAD = cheapestRate.shipping_amount.currency === 'inr' ? cheapestRate.shipping_amount.amount * exchangeRate : cheapestRate.shipping_amount.amount;
            newShippingRates[sellerId] = {
              ...cheapestRate,
              shipping_amount: {
                ...cheapestRate.shipping_amount,
                amount: amountInCAD,
                currency: 'cad', // Set the currency to CAD after conversion
              }
            };
            totalCost += amountInCAD;
          } else {
            throw new Error('Unable to find a valid shipping rate');
          }
        } catch (error) {
          console.error(`Error calculating shipping for seller ${sellerId}:`, error);
          newErrors[sellerId] = error.message;
        }
      }
    }

    if (totalIndiaWeight > 0) {
      console.log('Processing central warehouse shipment with weight:', totalIndiaWeight);
      try {
        const response = await fetch('/api/fedexApi', {
          cache: 'no-store',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          body: JSON.stringify({
            sellerAddress: CENTRAL_WAREHOUSE_ADDRESS,
            buyerAddress: {
              street: buyerAddress.address,
              city: buyerAddress.city,
              state: buyerAddress.state,
              zipCode: buyerAddress.zip,
              country: buyerAddress.country,
              phone: buyerAddress.phone || '',
            },
            packages: [{ weight: totalIndiaWeight, length: 10, width: 10, height: 10 }],
          }),
        });

        const rateData = await response.json();
        console.log('Central Warehouse API Response:', rateData);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (rateData.error) {
          throw new Error(rateData.error);
        }

        if (!rateData.rate_response || !rateData.rate_response.rates || rateData.rate_response.rates.length === 0) {
          console.warn('No shipping rates available from central warehouse. Full response:', rateData);
          throw new Error('No shipping rates available');
        }

        const cheapestRate = findCheapestRate(rateData.rate_response.rates);
        if (cheapestRate) {
          // Convert the rate to CAD if it is in INR
          const amountInCAD = cheapestRate.shipping_amount.currency === 'inr' ? cheapestRate.shipping_amount.amount * exchangeRate : cheapestRate.shipping_amount.amount;
          newShippingRates['centralWarehouse'] = {
            ...cheapestRate,
            shipping_amount: {
              ...cheapestRate.shipping_amount,
              amount: amountInCAD,
              currency: 'cad', // Set the currency to CAD after conversion
            }
          };
          totalCost += amountInCAD;
        } else {
          throw new Error('Unable to find a valid shipping rate');
        }
      } catch (error) {
        console.error('Error calculating shipping from central warehouse:', error);
        newErrors['centralWarehouse'] = error.message;
      }
    }

    console.log('Final shipping rates:', newShippingRates);
    console.log('Final errors:', newErrors);
    console.log('Total shipping cost:', totalCost);

    setShippingRates(newShippingRates);
    setTotalShippingCost(totalCost);
    setErrors(newErrors);
    setIsLoading(false);
  };

  const groupShipmentsBySeller = (cartItems) => {
    return cartItems.reduce((acc, item) => {
      if (!acc[item.seller_id]) {
        acc[item.seller_id] = {
          sellerAddress: {
            street: item.street,
            city: item.city,
            state: item.state,
            postal_code: item.postal_code,
            country: item.country,
            phone_num: item.phone_num,
          },
          items: [],
        };
      }
      acc[item.seller_id].items.push(item);
      return acc;
    }, {});
  };

  const calculatePackages = (items) => {
    return items.map(item => ({
      weight: parseFloat(item.quantity.toFixed(2)),
      length: 10,
      width: 10,
      height: 10,
    }));
  };

  const findCheapestRate = (rates) => {
    if (!rates || rates.length === 0) return null;
    return rates.reduce((cheapest, rate) => 
      (!cheapest || rate.shipping_amount.amount < cheapest.shipping_amount.amount) ? rate : cheapest
    );
  };

  if (isLoading) {
    return <div>Loading shipping rates...</div>;
  }

  return (
    <div className='text-black'>
      {Object.entries(errors).map(([sellerId, errorMessage]) => (
        <div key={sellerId} className="text-red-500">
          <p>Error for Seller {sellerId}: {errorMessage}</p>
        </div>
      ))}
      <div className="flex justify-between font-bold text-lg border-t pt-4">
        <p className="text-gray-800">Estimated Shipping Rate:</p>
        <p className="text-blue-700"> ${totalShippingCost.toFixed(2)}</p> 
      </div>
      {hasInternationalShipping && (
        <div className= "    text-red-500">
          <p>Due to International shipping from India, the cost is higher.</p>
        </div>
      )}
    </div>
  );
};

export default ShippingRateCalculator;
