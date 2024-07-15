import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  try {
    const requestData = await request.json();
    const {
      userId,
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      postalCode,
      countryCode,
      phone,

    } = requestData;

    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);

    const result = await sql`
      INSERT INTO addresses (user_id, address_first_name, address_last_name, address_email, street, city, state, postal_code, country, phone_num, address_type)
      VALUES (${userId}, ${firstName}, ${lastName}, ${email}, ${street}, ${city}, ${state}, ${postalCode}, ${countryCode}, ${phone}, 'shipping')
      RETURNING address_id;
    `;

    return new Response(JSON.stringify(result[0]), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error inserting address:', error);
    return new Response(JSON.stringify({ error: 'Failed to insert address' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
}