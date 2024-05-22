import {neon} from '@neondatabase/serverless'

export default async function POST(req) {
    try {
        const requestData = req.body;
        const databaseUrl = process.env.DATABASE_URL || "";
        const sql = neon(databaseUrl);
        const response = await sql`INSERT INTO m_User (userId, userType, userName, userEmail,  userAddress, userPhoneNum ) VALUES (${requestData.userId}, ${requestData.role}, ${requestData.name}, ${requestData.email}, ${requestData.address}, ${requestData.phone}) RETURNING *  `;
        if (response.length === 0) {
            return {
                status: 404,
                body: { message: "User not found" }
            }
        }
        return {
            status: 200,
            body: response
        }
    } catch (error) {
        console.error('An error occurred:', error);
        return {
            status: 500,
            body: { message: "Internal server error" }
        }
    }
}