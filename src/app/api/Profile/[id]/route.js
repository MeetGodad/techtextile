import { neon } from "@neondatabase/serverless";

export async function GET(req, { params }) {
    const id = params.id;
    console.log("User ID:", id);

    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);

    try {
        // Parameterized query for user details
        const response = await sql`
            SELECT * FROM useraccounts WHERE user_id = ${id}
        `;

        if (response.length === 0) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        let user = response[0];
        console.log("User Details:", user);

        if (user.user_type === "buyer") {
            // Parameterized query for buyer details
            const buyerResponse = await sql`
                SELECT * FROM buyers WHERE user_id = ${id}
            `;

            if (buyerResponse.length === 0) {
                return new Response(JSON.stringify({ message: "Buyer not found" }), { status: 404 });
            }

            user.buyerDetails = buyerResponse[0];
            console.log("Buyer Details:", user.buyerDetails);
        } else if (user.user_type === "seller") {
            // Parameterized query for seller details
            const sellerResponse = await sql`
                SELECT * FROM sellers WHERE user_id = ${id}
            `;

            if (sellerResponse.length === 0) {
                return new Response(JSON.stringify({ message: "Seller not found" }), { status: 404 });
            }

            user.sellerDetails = sellerResponse[0];
        }

        return new Response(JSON.stringify({ message: "User found", user }), { status: 200 });
    } catch (error) {
        console.error("Error fetching user details:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}