
import { neon } from '@neondatabase/serverless';



export async function POST(req) {
    try {
        console.log("Parsing request data");
        const requestData = await req.json();
        console.log("Requested Data:", requestData);

        const databaseUrl = process.env.DATABASE_URL || "";
        console.log("Database URL:", databaseUrl);

        const sql = neon(databaseUrl);
        console.log("Executing SQL query");

        const response = await sql`
            INSERT INTO m_user (userId, userType, userName, userEmail, userAddress, userPhoneNum)
            VALUES (${requestData.userId}, ${requestData.role}, ${requestData.name}, ${requestData.email}, ${requestData.address}, ${requestData.phone})
            RETURNING *;
        `;

        console.log("Response from database", response);

        if (response.length === 0) {
            return new Response(JSON.stringify({ message: "User not created" }), { status: 400 });
        }

        return new Response(JSON.stringify({ message: "User created successfully"  , user : response[0]  }), { status: 200 });
    } catch (error) {
        console.error('An error occurred: Internal server error', error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}



