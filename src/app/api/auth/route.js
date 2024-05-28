
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

            if (requestData.role === "buyer") {
                const buyerResponse = await sql`
                    INSERT INTO buyers (user_id, phone_num, shipping_address)
                    VALUES (${requestData.userId}, ${requestData.phone}, ${requestData.address}) RETURNING *;
                `;
                
                if (buyerResponse.length === 0) {
                    return new Response(JSON.stringify({ message: "Buyer not created" }), { status: 400 });
                } 
            } else if (requestData.role === "seller") {
                const sellerResponse = await sql`
                    INSERT INTO sellers (user_id, business_name, business_address, phone_num)
                    VALUES (${requestData.userId}, ${requestData.companyName}, ${requestData.address}, ${requestData.phone}) RETURNING *;
                `;
                
                if (sellerResponse.length === 0) {
                    return new Response(JSON.stringify({ message: "Seller not created" }), { status: 400 });
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



