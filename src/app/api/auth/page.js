import { neon} from "@neondatabase/serverless";


export async function POST(request) {

       try{
        console.log("Parsing request data");
        const requestData =  request.json();
        console.log("Requested Data :" , requestData);
        const databaseUrl = process.env.DATABASE_URL || "";
        console.log("Database URL:", databaseUrl);
        const sql = neon(databaseUrl);
        console.log("Executing SQL query");
        const response = sql`INSERT INTO m_user (userId, userType, userName, userEmail,  userAddress, userPhoneNum ) VALUES (${requestData.userId}, ${requestData.role}, ${requestData.name}, ${requestData.email}, ${requestData.address}, ${requestData.phone}) RETURNING *  `;
        console.log("Response from database", response);
        if(response.length === 0){
            return new Response(JSON.stringify({ message: "Error Creating User" }), { status: 404 });
        }
    
        return new Response(JSON.stringify(response), { status: 200 });
    }
    catch(error){
        console.error('An error occurred: Internal server error', error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
    
  }