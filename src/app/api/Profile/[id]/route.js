
// import { neon } from "@neondatabase/serverless";

// export async function GET(req, { params }) {

//     const id = params.id;
//     console.log("User ID:", id);

//     const databaseUrl = process.env.DATABASE_URL || "";
//     const sql = neon(databaseUrl);
//     const response = await sql`SELECT * FROM useraccounts WHERE user_id = ${id};`;

//     if (response.length === 0) {
//         return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
//     }

//     let user = response[0];

//     console.log("User Details:", user);
//     if (user.user_type === "buyer") {
//         const buyerResponse = await sql`SELECT * FROM buyers WHERE user_id = ${id};`;

//         if (buyerResponse.length === 0) {
//             return new Response(JSON.stringify({ message: "Buyer not found" }), { status: 404 });
//         }

//         user.buyerDetails = buyerResponse[0];
//         console.log("Buyer Details:", user.buyerDetails);
//     } else if (user.user_type === "seller") {
//         const sellerResponse = await sql`SELECT * FROM sellers WHERE user_id = ${id};`;

//         if (sellerResponse.length === 0) {
//             return new Response(JSON.stringify({ message: "Seller not found" }), { status: 404 });
//         }

//         user.sellerDetails = sellerResponse[0];
//     }



//     return new Response(JSON.stringify({ message: "User found", user }), { status: 200 });
// }



// export async function PUT(req) {
//     const databaseUrl = process.env.DATABASE_URL || "";
//     const sql = neon(databaseUrl);
//     const url = new URL(req.url);
//     const userId = url.pathname.split('/').pop();
//     const body = await req.json();

//     console.log("Updating User ID:", userId);

//     if (!userId) {
//         return new Response(JSON.stringify({ message: "userId is required" }), { status: 400 });
//     }

//     if (body.email) {
//         return new Response(JSON.stringify({ message: "Cannot change email address" }), { status: 400 });
//     }

//     try {
//         await sql.transaction(async (trx) => {
//             await trx`
//                 UPDATE useraccounts 
//                 SET first_name = ${body.firstName}, 
//                     last_name = ${body.lastName}
//                 WHERE user_id = ${userId};`;

//             const addressResult = await trx`
//                 SELECT address_id FROM addresses 
//                 WHERE street = ${body.address.street} 
//                 AND city = ${body.address.city} 
//                 AND state = ${body.address.state} 
//                 AND postal_code = ${body.address.postalCode};`;

//             let addressId;
//             if (addressResult.length > 0) {
//                 addressId = addressResult[0].address_id;
//             } else {
//                 const newAddressResult = await trx`
//                     INSERT INTO addresses (street, city, state, postal_code)
//                     VALUES (${body.address.street}, ${body.address.city}, ${body.address.state}, ${body.address.postalCode})
//                     ON CONFLICT DO NOTHING
//                     RETURNING address_id;`;
//                 if (newAddressResult.length > 0) {
//                     addressId = newAddressResult[0].address_id;
//                 } else {
//                     throw new Error("Failed to insert or find address");
//                 }
//             }

//             if (body.role === 'seller') {
//                 await trx`
//                     UPDATE sellers 
//                     SET business_name = ${body.companyName}, 
//                         business_address = ${addressId}, 
//                         phone_num = ${body.phone}
//                     WHERE user_id = ${userId};`;
//             } else if (body.role === 'buyer') {
//                 await trx`
//                     UPDATE buyers 
//                     SET user_address = ${addressId}, 
//                         phone_num = ${body.phone}
//                     WHERE user_id = ${userId};`;
//             }
//         });

//         return new Response(JSON.stringify({ message: "User information updated" }), { status: 200 });
//     } catch (error) {
//         console.error('An error occurred: Internal server error', error);
//         return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
//     }
// }
//*********************************************************** */
// import { neon } from '@neondatabase/serverless';
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';
// const MySwal = withReactContent(Swal);

// export async function GET(req, { params }) {
//   const userId = params.id;
//   const databaseUrl = process.env.DATABASE_URL || "";
//   const sql = neon(databaseUrl);

//   try {
//     const user = await sql`
//       SELECT ua.user_id, ua.email, ua.first_name, ua.last_name, ua.user_type, a.street, a.city, a.state, a.postal_code, s.business_name, s.phone_num
//       FROM UserAccounts ua
//       LEFT JOIN Addresses a ON ua.user_id = a.user_id
//       LEFT JOIN Sellers s ON ua.user_id = s.user_id
//       WHERE ua.user_id = ${userId};`;

//     if (user.length === 0) {
//       return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
//     }

//     return new Response(JSON.stringify({ user: user[0] }), { status: 200 });
//   } catch (error) {
//     console.error('An error occurred:', error);
//     return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
//   }
// }

import { neon } from '@neondatabase/serverless';

export async function GET(req, { params }) {
  const userId = params.id;
  const databaseUrl = process.env.DATABASE_URL || "";
  const sql = neon(databaseUrl);

  try {
    const userResponse = await sql`
      SELECT ua.user_id, ua.email, ua.first_name, ua.last_name, ua.user_type,
             a.street, a.city, a.state, a.postal_code,
             b.phone_num as buyer_phone, s.business_name, s.phone_num as seller_phone
      FROM UserAccounts ua
      LEFT JOIN Addresses a ON ua.user_id = a.user_id
      LEFT JOIN Buyers b ON ua.user_id = b.user_id
      LEFT JOIN Sellers s ON ua.user_id = s.user_id
      WHERE ua.user_id = ${userId};
    `;

    if (userResponse.length === 0) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    const user = userResponse[0];
    const userInfo = {
      ...user,
      phone_num: user.user_type === 'buyer' ? user.buyer_phone : user.seller_phone,
    };

    return new Response(JSON.stringify({ user: userInfo }), { status: 200 });
  } catch (error) {
    console.error('An error occurred:', error);
    return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const userId = params.id;
  const { firstName, lastName, phone, address, companyName, role } = await req.json();
  const databaseUrl = process.env.DATABASE_URL || "";
  const sql = neon(databaseUrl);

  try {
    if (!firstName || !lastName || !phone || !address || !address.street || !address.city || !address.state || !address.postalCode) {
      throw new Error("Missing parameters");
    }

    await sql.transaction(async (trx) => {
      await trx`UPDATE UserAccounts SET first_name = ${firstName}, last_name = ${lastName} WHERE user_id = ${userId};`;
      await trx`UPDATE Addresses SET street = ${address.street}, city = ${address.city}, state = ${address.state}, postal_code = ${address.postalCode} WHERE user_id = ${userId};`;

      if (role === 'seller') {
        await trx`UPDATE Sellers SET business_name = ${companyName}, phone_num = ${phone} WHERE user_id = ${userId};`;
      } else if (role === 'buyer') {
        await trx`UPDATE Buyers SET phone_num = ${phone} WHERE user_id = ${userId};`;
      }
    });

    return new Response(JSON.stringify({ message: "User updated successfully" }), { status: 200 });
  } catch (error) {
    console.error('An error occurred:', error);
    return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
  }
}
