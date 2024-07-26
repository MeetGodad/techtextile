import { exchangeRates } from 'exchange-rates-api';
import { isEqual, debounce } from 'lodash';

const CENTRAL_WAREHOUSE_ADDRESS = {
  street: 'No 4 Shubhlaxmi Bunglows',
  city: 'Surat',
  state: 'GJ',
  zipCode: '395017',
  country: 'IN',
  phone_num: '4039510992',
};

const AVERAGE_FABRIC_WEIGHT = 0.15;

const calculateProductWeight = (item) => {
  if (item.product_type === 'fabric') {
    return parseFloat((item.quantity * AVERAGE_FABRIC_WEIGHT).toFixed(2));
  } else {
    return parseFloat(item.quantity.toFixed(2));
  }
};

const groupShipmentsBySeller = (cartItems) => {
  return cartItems.reduce((acc, item) => {
    if (!acc[item.seller_address.address_id]) {
      acc[item.seller_address.address_id] = {
        sellerAddress: item.seller_address,
        items: [],
        isIndianSeller: item.seller_address.country === 'IN'
      };
    }
    acc[item.seller_address.address_id].items.push(item);
    return acc;
  }, {});
};

const calculatePackages = (items) => {
  return items.map(item => ({
    weight: calculateProductWeight(item),
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

const calculateShippingCost = async (buyerAddress, cartItems) => {
  let totalCost = 0;
  let totalIndiaWeight = 0;
  const indianSellers = [];
  let hasInternationalShipping = false;
  const shippingDetails = {};

  console.log('Calculating shipping cost for:', buyerAddress, cartItems);

  let exchangeRate = 0.016;
  try {
    const rateData = await exchangeRates().latest().base('INR').symbols('CAD').fetch();
    exchangeRate = rateData.rates.CAD;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
  }

  const shipmentsBySeller = groupShipmentsBySeller(cartItems);

  for (const [sellerId, shipment] of Object.entries(shipmentsBySeller)) {
    console.log('shipment:', shipment);
    const sellerAddress = shipment.sellerAddress;

    console.log('Calculating shipping for seller:', sellerId, sellerAddress, shipment.items);

    if (sellerAddress.country === 'IN') {
      totalIndiaWeight += shipment.items.reduce((acc, item) => acc + calculateProductWeight(item), 0);
      hasInternationalShipping = true;
      indianSellers.push(sellerId);
    } else {
      try {
        const response = await fetch('/api/fedexApi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({
            sellerAddress: {
                street: sellerAddress.street,
                city: sellerAddress.city,
                state: sellerAddress.state,
                zipCode: sellerAddress.postal_code, // Ensure this uses sellerAddress.zipCode
                country: sellerAddress.country,
                phone: sellerAddress.phone_num || '1234567890', // Also corrected to use phone_num from sellerAddress
              },
            buyerAddress: {
              street: buyerAddress.street,
              city: buyerAddress.city,
              state: buyerAddress.state,
              zipCode: buyerAddress.postal_code,
              country: buyerAddress.country,
              phone: buyerAddress.phone || '1234567890',
            },
            packages: calculatePackages(shipment.items),
          }),
        });

        const rateData = await response.json();

        console.log('Shipping rate data:', rateData);

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
    
          shippingDetails[sellerId] = {
            rateId: cheapestRate.rate_id,
            carrierId: cheapestRate.carrier_id,
            serviceCode: cheapestRate.service_code,
            shipmentId: rateData.shipment_id,
            amount: amountInCAD,
            currency: 'cad',
            deliveryDays: cheapestRate.delivery_days,
            items: shipment.items
          };
    
          totalCost += amountInCAD;
        } else {
          throw new Error('Unable to find a valid shipping rate');
        }
      } catch (error) {
        console.error(`Error calculating shipping for seller ${sellerId}:`, error);
      }
    }
  }

  if (totalIndiaWeight > 0) {
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
            zipCode: buyerAddress.postal_code,
            country: buyerAddress.country,
            phone: buyerAddress.phone || '',
          },
          packages: [{ weight: totalIndiaWeight, length: 10, width: 10, height: 10 }],
        }),
      });

      const rateData = await response.json();

      if (!response.ok || rateData.error) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Central warehouse shipping rate data:', rateData);
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
  
        shippingDetails['centralWarehouse'] = {
          rateId: cheapestRate.rate_id,
          carrierId: cheapestRate.carrier_id,
          serviceCode: cheapestRate.service_code,
          shipmentId: rateData.shipment_id,
          amount: amountInCAD,
          currency: 'cad',
          deliveryDays: cheapestRate.delivery_days,
          indianSellers: indianSellers
        };
  
        totalCost += amountInCAD;
      } else {
        throw new Error('Unable to find a valid shipping rate');
      }
    } catch (error) {
      console.error('Error calculating shipping from central warehouse:', error);
    }
  }

  return {
    totalCost,
    shippingDetails,
  };
};

export default calculateShippingCost;