import {neon} from '@neondatabase/serverless'

export default async function POST (request) {
    
        const requestData = await request.json();
        const databaseUrl = process.env.DATABASE_URL || "";
        const sql = neon(databaseUrl);
        const response = await sql`INSERT INTO m_User (userId, userName,  userType, userAddress, userPhoneNum, userEmail) VALUES (${requestData.userId}, ${requestData.userName}, ${requestData.userPassword}, ${requestData.userType}, ${requestData.userAddress}, ${requestData.userPhoneNum}, ${requestData.userEmail}) RETURNING *;`;

        return {
            status: 200,
            body: response
        }
    }