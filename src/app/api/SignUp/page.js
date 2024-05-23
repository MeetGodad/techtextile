import {neon} from '@neondatabase/serverless';
import {bcrypt} from 'bcryptjs';

async function passwordEncryption (password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

export async function POST (request) {

    const requestData = await request.json();

    const hashedPassword = await passwordEncryption(requestData.password);

    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);
    const response = await sql` INSERT INTO M_User (userName, userEmail, userPassword, userAddress, userPhoneNum, userType) VALUES (${requestData.userName}, ${requestData.userEmail}, ${hashedPassword}, ${requestData.userAddress}, ${requestData.userPhoneNum}, ${requestData.userType}) RETURNING *;`;

    if (response.length === 0) {
        return new Response(JSON.stringify({ message: "Invalid email or password" }), { status: 401 });
    }
    return new Response(JSON.stringify(response), { status: 200 });
}