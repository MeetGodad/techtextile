import {neon} from '@neondatabase/serverless'


export async function POST(request) {

    try{
        const requestData = await request.json();
        console.log( "Requested Data :" , requestData);
        const databaseUrl = process.env.DATABASE_URL || "";
        const sql = neon(databaseUrl);
        const response = await sql`INSERT INTO m_user (userId, userType, userName, userEmail,  userAddress, userPhoneNum ) VALUES (${requestData.userId}, ${requestData.role}, ${requestData.name}, ${requestData.email}, ${requestData.address}, ${requestData.phone}) RETURNING *  `;
        if(response.length === 0){
            return new Response(JSON.stringify({ message: "Error Creating User" }), { status: 404 });
        }
    
        return new Response(JSON.stringify(plainObject), { status: 200 });
    }
    catch(error){
        console.error('An error occurred: Internal server error', error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}