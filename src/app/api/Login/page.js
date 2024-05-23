import  {neon} from '@neondatabase/serverless';
import {bcrypt} from 'bcryptjs';

async function passwordEncryption (password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

<<<<<<< Updated upstream
export async function GET(email, password) {
=======

export async function GET(request) {
>>>>>>> Stashed changes

    const requestData = await request.json();
    const hashedPassword = await passwordEncryption(requestData.password);

    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);
    const response = await sql`SELECT * FROM m_user WHERE userId=${requestData.userId} ;`;

    if (response.length === 0) {
        return new Response(JSON.stringify({ message: "Invalid email or password" }), { status: 401 });
    }
    return new Response(JSON.stringify(response), { status: 200 });
}

