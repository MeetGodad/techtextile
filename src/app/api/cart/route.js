import { neon } from "@neondatabase/serverless";


// export async function POST(request) {

//   try {
  
//       const requestData = await request.json();
//       const databaseUrl = process.env.DATABASE_URL || "";
//       const sql = neon(databaseUrl);
      

//       let cart = await sql`
//       SELECT * FROM ShoppingCart WHERE user_id = ${requestData.userId} `;


//       if (cart.length === 0) {
//           cart = await sql`
//           INSERT INTO ShoppingCart (user_id) VALUES (${requestData.userId}) RETURNING *`;
//       }
//       console.log(cart[0]);

//       let cartItem = await sql`
//       SELECT * FROM CartItems WHERE cart_id = ${cart[0].cart_id} AND product_id = ${requestData.productId}`;

//       if (cartItem.length === 0) {
//           cartItem = await sql`
//           INSERT INTO CartItems (cart_id, product_id, quantity) VALUES (${cart[0].cart_id}, ${requestData.productId}, 1) RETURNING *`;
//       } else {
//           cartItem = await sql`
//           UPDATE CartItems SET quantity = ${cartItem[0].quantity + 1} WHERE cart_id = ${cart[0].cart_id} AND product_id = ${requestData.productId} RETURNING *`;
//       }

//       if (cartItem.length === 0) {
//           throw new Error('Failed to add the product to the cart.');
//       }

//       return new Response(JSON.stringify(cartItem[0]), {  status: 200, headers: { 'Content-Type': 'application/json' } });
//   }
//   catch (error) {
//     return new Response(JSON.stringify({
//       status: 500,
//       body: {
//           error: error.message,
//       },
//   }), { status: 500, headers: { 'Content-Type': 'application/json' } });
//   }

// }

export async function POST(request) {
    try {
      const requestData = await request.json();
      const databaseUrl = process.env.DATABASE_URL || "";
      const sql = neon(databaseUrl);

    
  
      // Check if the user has an existing cart
      let cart = await sql`
        SELECT * FROM ShoppingCart WHERE user_id = ${requestData.userId}`;
  
    if(requestData.userId === undefined){
        return new Response(JSON.stringify({
            status: 400,
            body: {
            error: 'User ID is required',
            },
        }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
      // If no cart exists, create a new one
      if (cart.length === 0) {
        cart = await sql`
          INSERT INTO ShoppingCart (user_id) VALUES (${requestData.userId}) RETURNING *`;
      }
  
      // Check if the product with the same variants already exists in the cart
      let cartItem = await sql`
        SELECT * FROM CartItems 
        WHERE cart_id = ${cart[0].cart_id} 
        AND product_id = ${requestData.productId}
        AND variant_ids = ${requestData.variantIds}::int[]`;
  
      if (cartItem.length === 0) {
        cartItem = await sql`
          INSERT INTO CartItems (cart_id, product_id, quantity, variant_ids) 
          VALUES (${cart[0].cart_id}, ${requestData.productId}, ${requestData.quantity}, ${requestData.variantIds}::int[]) 
          RETURNING *`;
      } else {
        cartItem = await sql`
          UPDATE CartItems 
          SET quantity = quantity + ${requestData.quantity} 
          WHERE cart_id = ${cart[0].cart_id} 
          AND product_id = ${requestData.productId}
          AND variant_ids = ${requestData.variantIds}::int[]
          RETURNING *`;
      }
  
      if (cartItem.length === 0) {
        throw new Error('Failed to add the product to the cart.');
      }
  
      return new Response(JSON.stringify(cartItem[0]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        status: 500,
        body: {
          error: error.message,
        },
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
  