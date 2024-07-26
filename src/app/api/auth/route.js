import { neon } from '@neondatabase/serverless';

export async function POST(req) {
    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);
    try {
        const requestData = await req.json();
        console.log("Requested Data:", requestData);

        // Start the transaction
        await sql`BEGIN`;

        try {
            const response = await sql`
                INSERT INTO useraccounts (user_id, user_type, first_name ,last_name, email)
                VALUES (${requestData.userId}, ${requestData.role}, ${requestData.firstName}, ${requestData.LastName}, ${requestData.email}) RETURNING *;`;

            if (requestData.role === "buyer" || requestData.role === "seller") {
                // Insert address data into Addresses
                const addressResponse = await sql`
                    INSERT INTO addresses (user_id, address_type, address_first_name, address_last_name, address_email, phone_num, street, city, state, postal_code, country)
                    VALUES (${requestData.userId}, ${'billing'}, ${requestData.firstName}, ${requestData.LastName}, ${requestData.email}, ${requestData.phone}, ${requestData.address.street}, ${requestData.address.city}, ${requestData.address.state}, ${requestData.address.postalCode}, ${requestData.address.country}) RETURNING *;`;

                if (requestData.role === "buyer") {
                    // Insert buyer data into Buyers
                    await sql`
                        INSERT INTO buyers (user_id, phone_num, user_address)
                        VALUES (${requestData.userId}, ${requestData.phone}, ${addressResponse[0].address_id}) RETURNING *;`;
                } else if (requestData.role === "seller") {
                    // Insert seller data into Sellers
                    await sql`
                        INSERT INTO sellers (user_id, business_name, phone_num, business_address)
                        VALUES (${requestData.userId}, ${requestData.companyName}, ${requestData.phone}, ${addressResponse[0].address_id}) RETURNING *;`;
                }
            }

            if (response.length === 0) {
                throw new Error("User not created");
            }

            // Commit the transaction
            await sql`COMMIT`;

            console.log("Response:", response[0]);
            return new Response(JSON.stringify({ message: "User created successfully", user: response[0] }), { status: 200 });
        } catch (transactionError) {
            // Rollback the transaction in case of error
            await sql`ROLLBACK`;
            console.error('Transaction error:', transactionError);
            return new Response(JSON.stringify({ message: "Internal server error", error: transactionError.message }), { status: 500 });
        }
    } catch (error) {
        console.error('An error occurred:', error);

        let errorMessage = "Internal server error";
        let statusCode = 500;

        // Handle specific PostgreSQL error codes
        switch (error.code) {
            case '23505': // unique_violation
                if (error.constraint === 'useraccounts_email_key') {
                    errorMessage = "Email address already in use";
                    statusCode = 409; // Conflict
                }
                break;
            case '23514': // check_violation
                if (error.constraint === 'useraccounts_user_type_check') {
                    errorMessage = "Invalid user type. Must be 'buyer' or 'seller'";
                    statusCode = 400; // Bad Request
                } else if (error.constraint === 'addresses_address_type_check') {
                    errorMessage = "Invalid address type. Must be 'billing' or 'shipping'";
                    statusCode = 400;
                } else if (error.constraint === 'addresses_phone_num_check' || 
                           error.constraint === 'buyers_phone_num_check' || 
                           error.constraint === 'sellers_phone_num_check') {
                    errorMessage = "Invalid phone number. Must be between 1000000000 and 9999999999";
                    statusCode = 400;
                }
                break;
            case '23502': // not_null_violation
                errorMessage = `Missing required field: ${error.column}`;
                statusCode = 400;
                break;
            default:
                // For any other errors, keep the generic message
                break;
        }

        return new Response(JSON.stringify({ message: errorMessage, error: error.message }), { status: statusCode });
    }
}
