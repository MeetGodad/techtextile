
import { neon } from "@neondatabase/serverless";

export async function GET(req, { params }) {

    const id = params.id;
    console.log("User ID:", id);

    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);
    const response = await sql`SELECT * FROM useraccounts WHERE user_id = ${id};`;

    if (response.length === 0) {
        return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    let user = response[0];

    console.log("User Details:", user);
    if (user.user_type === "buyer") {
        const buyerResponse = await sql`SELECT * FROM buyers WHERE user_id = ${id};`;

        if (buyerResponse.length === 0) {
            return new Response(JSON.stringify({ message: "Buyer not found" }), { status: 404 });
        }

        user.buyerDetails = buyerResponse[0];
        console.log("Buyer Details:", user.buyerDetails);
    } else if (user.user_type === "seller") {
        const sellerResponse = await sql`SELECT * FROM sellers WHERE user_id = ${id};`;

        if (sellerResponse.length === 0) {
            return new Response(JSON.stringify({ message: "Seller not found" }), { status: 404 });
        }

        user.sellerDetails = sellerResponse[0];
    }



    return new Response(JSON.stringify({ message: "User found", user }), { status: 200 });
}



export async function PUT(req) {
    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);
    const url = new URL(req.url);
    const userId = url.pathname.split('/').pop();
    const body = await req.json();

    console.log("Updating User ID:", userId);

    if (!userId) {
        return new Response(JSON.stringify({ message: "userId is required" }), { status: 400 });
    }

    if (body.email) {
        return new Response(JSON.stringify({ message: "Cannot change email address" }), { status: 400 });
    }

    try {
        await sql.transaction(async (trx) => {
            await trx`
                UPDATE useraccounts 
                SET first_name = ${body.firstName}, 
                    last_name = ${body.lastName}
                WHERE user_id = ${userId};`;

            const addressResult = await trx`
                SELECT address_id FROM addresses 
                WHERE street = ${body.address.street} 
                AND city = ${body.address.city} 
                AND state = ${body.address.state} 
                AND postal_code = ${body.address.postalCode};`;

            let addressId;
            if (addressResult.length > 0) {
                addressId = addressResult[0].address_id;
            } else {
                const newAddressResult = await trx`
                    INSERT INTO addresses (street, city, state, postal_code)
                    VALUES (${body.address.street}, ${body.address.city}, ${body.address.state}, ${body.address.postalCode})
                    ON CONFLICT DO NOTHING
                    RETURNING address_id;`;
                if (newAddressResult.length > 0) {
                    addressId = newAddressResult[0].address_id;
                } else {
                    throw new Error("Failed to insert or find address");
                }
            }

            if (body.role === 'seller') {
                await trx`
                    UPDATE sellers 
                    SET business_name = ${body.companyName}, 
                        business_address = ${addressId}, 
                        phone_num = ${body.phone}
                    WHERE user_id = ${userId};`;
            } else if (body.role === 'buyer') {
                await trx`
                    UPDATE buyers 
                    SET user_address = ${addressId}, 
                        phone_num = ${body.phone}
                    WHERE user_id = ${userId};`;
            }
        });

        return new Response(JSON.stringify({ message: "User information updated" }), { status: 200 });
    } catch (error) {
        console.error('An error occurred: Internal server error', error);
        return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
    }
}