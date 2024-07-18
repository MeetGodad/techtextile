// Perplexity AI

import { useState, useEffect , useMemo , useCallback , useRef} from 'react';
import { exchangeRates } from 'exchange-rates-api';
import { isEqual, debounce } from 'lodash';

const ShippingRateCalculator = ({ cartItems, buyerAddress ,onTotalShippingCostChange , onShippingDetailsChange }) => {
  const [shippingRates, setShippingRates] = useState({});
  const [totalShippingCost, setTotalShippingCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const hasInternationalShippingRef = useRef(false);
  const [selectedShippingDetails, setSelectedShippingDetails] = useState({});
  const memoizedCartItems = useMemo(() => cartItems, [JSON.stringify(cartItems)]);
  const memoizedBuyerAddress = useMemo(() => buyerAddress, [JSON.stringify(buyerAddress)]);

  useEffect(() => {
    onTotalShippingCostChange(totalShippingCost);
    onShippingDetailsChange(selectedShippingDetails);
  }, [totalShippingCost, selectedShippingDetails, onTotalShippingCostChange, onShippingDetailsChange]);

  const CENTRAL_WAREHOUSE_ADDRESS = {
    street: 'No 4 Shubhlaxmi Bunglows',
    city: 'Surat',
    state: 'GJ',
    zipCode: '395017',
    country: 'IN',
    phone_num: '4039510992',
  };

  const AVERAGE_FABRIC_WEIGHT = 0.15;

  const calculateProductWeight = useCallback((item) => {
    if (item.product_type === 'fabric') {
      return parseFloat((item.quantity * AVERAGE_FABRIC_WEIGHT).toFixed(2));
    } else {
      return parseFloat(item.quantity.toFixed(2));
    }
  }, []);

  const groupShipmentsBySeller = useCallback((cartItems) => {
    return cartItems.reduce((acc, item) => {
      if (!acc[item.seller_id]) {
        acc[item.seller_id] = {
          sellerAddress: {
            street: item.street,
            city: item.city,
            state: item.state,
            zipCode: item.postal_code,
            country: item.country,
            phone_num: item.phone_num,
          },
          items: [],
          isIndianSeller: item.country === 'IN'
        };
      }
      acc[item.seller_id].items.push(item);
      return acc;
    }, {});
  }, []);

  const calculatePackages = useCallback((items) => {
    return items.map(item => ({
      weight: calculateProductWeight(item),
      length: 10,
      width: 10,
      height: 10,
    }));
  }, [calculateProductWeight]);

  const findCheapestRate = useCallback((rates) => {
    if (!rates || rates.length === 0) return null;
    return rates.reduce((cheapest, rate) => 
      (!cheapest || rate.shipping_amount.amount < cheapest.shipping_amount.amount) ? rate : cheapest
    );
  }, []);

  const calculateShippingRates = useCallback(async () => {
    setIsLoading(true);
    setErrors({});
    const shipmentsBySeller = groupShipmentsBySeller(memoizedCartItems);
    let totalCost = 0;
    const newShippingRates = {};
    const newErrors = {};
    let totalIndiaWeight = 0;
    const indianSellers = [];

    let exchangeRate = 0.016;
    try {
      const rateData = await exchangeRates().latest().base('INR').symbols('CAD').fetch();
      exchangeRate = rateData.rates.CAD;
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }

    for (const [sellerId, shipment] of Object.entries(shipmentsBySeller)) {
      const sellerAddress = shipment.sellerAddress;
      console.log(`Processing shipment for seller ${sellerId}:`, shipment);
      const packages = calculatePackages(shipment.items);
      console.log(`Packages for seller ${sellerId}:`, packages);
      console.log(`Calculating shipping for seller ${sellerId} with packages: Seller Address:`, sellerAddress);
      if (sellerAddress.country === 'IN') {
        totalIndiaWeight += packages.reduce((acc, pkg) => acc + pkg.weight, 0);
        hasInternationalShippingRef.current = true;
        indianSellers.push(sellerId);
      } else {
        try {
          const response = await fetch('/api/fedexApi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
              sellerAddress,
              buyerAddress: {
                street: buyerAddress.street,
                city: buyerAddress.city,
                state: buyerAddress.state,
                zipCode: buyerAddress.zip,
                country: buyerAddress.country,
                phone: buyerAddress.phone || '1234567890',
              },
              packages,
            }),
          });

          const rateData = await response.json();

          console.log(`API Response for seller ${sellerId}:`, rateData);

          if (!response.ok || rateData.error) {
            throw new Error(rateData.error || `HTTP error! status: ${response.status}`);
          }

          let ratesToUse = [];
          if (rateData.rate_response && rateData.rate_response.rates && rateData.rate_response.rates.length > 0) {
            ratesToUse = rateData.rate_response.rates;
          } else if (rateData.rate_response && rateData.rate_response.invalid_rates && rateData.rate_response.invalid_rates.length > 0) {
            ratesToUse = rateData.rate_response.invalid_rates;
            console.warn(`Using invalid rates for seller. These rates may not be accurate.`);
          } else {
            console.log(`No shipping rates available for seller. Full response:`, rateData);
            throw new Error('No shipping rates available');
          }

          const cheapestRate = findCheapestRate(ratesToUse);
          if (cheapestRate) {
            const amountInCAD = cheapestRate.shipping_amount.currency === 'inr'
              ? cheapestRate.shipping_amount.amount * exchangeRate
              : cheapestRate.shipping_amount.amount;
      
            newShippingRates[sellerId] = {
              ...cheapestRate,
              shipping_amount: {
                ...cheapestRate.shipping_amount,
                amount: amountInCAD,
                currency: 'cad',
              }
            };
      
            setSelectedShippingDetails(prevDetails => ({
              ...prevDetails,
              [sellerId]: {
                rateId: cheapestRate.rate_id,
                carrierId: cheapestRate.carrier_id,
                serviceCode: cheapestRate.service_code,
                shipmentId: rateData.shipment_id,
                amount: amountInCAD,
                currency: 'cad',
                deliveryDays: cheapestRate.delivery_days,
                items: shipment.items
              }
            }));
      
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
              street: buyerAddress.street,
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

        let ratesToUse = [];
      if (rateData.rate_response && rateData.rate_response.rates && rateData.rate_response.rates.length > 0) {
        ratesToUse = rateData.rate_response.rates;
      } else if (rateData.rate_response && rateData.rate_response.invalid_rates && rateData.rate_response.invalid_rates.length > 0) {
        ratesToUse = rateData.rate_response.invalid_rates;
        console.warn(`Using invalid rates for seller. These rates may not be accurate.`);
      } else {
        console.log(`No shipping rates available for seller. Full response:`, rateData);
        throw new Error('No shipping rates available');
      }

      const cheapestRate = findCheapestRate(ratesToUse);
      if (cheapestRate) {
        const amountInCAD = cheapestRate.shipping_amount.currency === 'inr'
          ? cheapestRate.shipping_amount.amount * exchangeRate
          : cheapestRate.shipping_amount.amount;
  
        newShippingRates['centralWarehouse'] = {
          ...cheapestRate,
          shipping_amount: {...cheapestRate.shipping_amount, amount: amountInCAD, currency: 'cad'},
          indianSellers: indianSellers
        };
  
        setSelectedShippingDetails(prevDetails => ({
          ...prevDetails,
          centralWarehouse: {
            rateId: cheapestRate.rate_id,
            carrierId: cheapestRate.carrier_id,
            serviceCode: cheapestRate.service_code,
            shipmentId: rateData.shipment_id,
            amount: amountInCAD,
            currency: 'cad',
            deliveryDays: cheapestRate.delivery_days,
            indianSellers: indianSellers
          }
        }));
  
        totalCost += amountInCAD;
    
          // Log warnings if using invalid rates
          if (cheapestRate.validation_status === 'invalid') {
            console.warn(`Warning for central warehouse:`, cheapestRate.warning_messages);
            console.error(`Errors for central warehouse:`, cheapestRate.error_messages);
          }
      } else {
          throw new Error('Unable to find a valid shipping rate');
      }
      } catch (error) {
        console.error('Error calculating shipping from central warehouse:', error);
        newErrors['centralWarehouse'] = error.message;
      }
    }

    if (!isEqual(newShippingRates, shippingRates)) {
      setShippingRates(newShippingRates);
    }
    
    if (totalCost !== totalShippingCost) {
      setTotalShippingCost(totalCost);
    }
    
    if (!isEqual(newErrors, errors)) {
      setErrors(newErrors);
    }
    
    setIsLoading(false);
  }, [memoizedCartItems, memoizedBuyerAddress, calculatePackages, findCheapestRate , groupShipmentsBySeller]);

  const debouncedCalculateShippingRates = useMemo(
    () => debounce(calculateShippingRates, 300),
    [calculateShippingRates]
  ); 
  
  useEffect(() => {
    debouncedCalculateShippingRates();
    return () => debouncedCalculateShippingRates.cancel();
  }, [memoizedCartItems, memoizedBuyerAddress, debouncedCalculateShippingRates]);


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
      {hasInternationalShippingRef.current &&  (
        <div className= "text-red-500">
          <p>Due to International shipping from India, the cost is higher.</p>
        </div>
      )}
    </div>
  );
};

export default ShippingRateCalculator;

