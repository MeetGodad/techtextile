import {neon} from '@neondatabase/serverless'


export default async function GET (request) {

    const requestData = await request.json();
    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);
    const response = await sql`SELECT * FROM m_User WHERE userId = ${requestData.UserId} ; `;
    if (response.length === 0) {
        return {
            status: 404,
            body: {message: "User not found"}
        }
    }
    return {
        status: 200,
        body: response
    }
}