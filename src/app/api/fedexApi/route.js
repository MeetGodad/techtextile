// import { getFedExRate } from "./fedexapi";

// export async function POST(req) {
//     try {
//       const { origin, destination, products } = await req.json();
//       const rateData = await getFedExRate(origin, destination, products);
//       return new Response(JSON.stringify(rateData), {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     } catch (error) {
//       console.error('Error in FedEx API route:', error);
//       return new Response(JSON.stringify({ error: error.message }), {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }
//   }

import { shippingRates } from './fedexapi';

export async function POST(req) {
  try {
    const { sellerAddress, buyerAddress, packages } = await req.json();

    console.log('FedEx API  Backend Request:', { sellerAddress, buyerAddress, packages });

    if (!Array.isArray(packages) || packages.length === 0) {
      throw new Error("Packages is required and must not be empty");
    }

    const rateData = await shippingRates(sellerAddress, buyerAddress, packages);

    if (rateData.error) {
      throw new Error(rateData.error);
    }

    return new Response(JSON.stringify(rateData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in FedEx API route:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
