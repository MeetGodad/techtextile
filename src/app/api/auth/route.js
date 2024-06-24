
import { neon } from '@neondatabase/serverless';


export async function POST(req) {
    try {
        const requestData = await req.json();
        console.log("Requested Data:", requestData);

        const databaseUrl = process.env.DATABASE_URL || "";

        const sql = neon(databaseUrl);

        const response = await sql`
            INSERT INTO useraccounts (user_id, user_type, first_name ,last_name, email)
            VALUES (${requestData.userId}, ${requestData.role}, ${requestData.firstName}, ${requestData.LastName}, ${requestData.email}) RETURNING *;`;

            if (requestData.role === "buyer" || requestData.role === "seller") {
                // Insert address data into Addresses
                const addressResponse = await sql`
                    INSERT INTO addresses (user_id, address_type,address_first_name, address_last_name, address_email, street, city, state, postal_code)
                    VALUES (${requestData.userId}, ${'billing'},${requestData.firstName}, ${requestData.LastName}, ${requestData.email}, ${requestData.address.street}, ${requestData.address.city}, ${requestData.address.state}, ${requestData.address.postalCode}) RETURNING *;`;
    
                if (requestData.role === "buyer") {
                    // Insert buyer data into Buyers
                    await sql`
                        INSERT INTO buyers (user_id, phone_num, user_address)
                        VALUES (${requestData.userId}, ${requestData.phone}, ${addressResponse[0].address_id}) RETURNING *;`;
                } else if (requestData.role === "seller"){
                    // Insert seller data into Sellers
                    await sql`
                        INSERT INTO sellers (user_id, business_name, phone_num, business_address)
                        VALUES (${requestData.userId}, ${requestData.companyName}, ${requestData.phone}, ${addressResponse[0].address_id}) RETURNING *;`;
                }
            }

        if (response.length === 0) {
            return new Response(JSON.stringify({ message: "User not created" }), { status: 400 });
        }

        console.log("Response:", response[0]);
        return new Response(JSON.stringify({ message: "User created successfully"  , user : response[0]  }), { status: 200 });


    } catch (error) {
        console.error('An error occurred: Internal server error', error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}



