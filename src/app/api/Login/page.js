import  {neon} from '@neondatabase/serverless';
import {bcrypt} from 'bcryptjs';

async function passwordEncryption (password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}


export async function GET(email, password) {


    const hashedPassword = await passwordEncryption(password);

    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);
    const response = await sql`SELECT * FROM m_user WHERE email=${email} AND password=${hashedPassword};`;

    if (response.length === 0) {
        return new Response(JSON.stringify({ message: "Invalid email or password" }), { status: 401 });
    }
    return new Response(JSON.stringify(response), { status: 200 });
}