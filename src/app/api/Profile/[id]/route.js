
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

    if (user.user_type === "buyer") {
        const buyerResponse = await sql`SELECT * FROM buyers WHERE user_id = ${id};`;

        if (buyerResponse.length === 0) {
            return new Response(JSON.stringify({ message: "Buyer not found" }), { status: 404 });
        }

        user.buyerDetails = buyerResponse[0];
    } else if (user.user_type === "seller") {
        const sellerResponse = await sql`SELECT * FROM sellers WHERE user_id = ${id};`;

        if (sellerResponse.length === 0) {
            return new Response(JSON.stringify({ message: "Seller not found" }), { status: 404 });
        }

        user.sellerDetails = sellerResponse[0];
    }



    return new Response(JSON.stringify({ message: "User found", user }), { status: 200 });
}