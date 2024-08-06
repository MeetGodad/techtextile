import { neon } from '@neondatabase/serverless';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

export const fetchCache = 'force-no-store';
export const revalidate = 0; // seconds
export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
    const userId = params.id;
    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);
  
    try {
        const user = await sql`SELECT ua.user_id, ua.email, ua.first_name, ua.last_name, ua.user_type, 
                                      a.street, a.city, a.state, a.postal_code, 
                                      b.phone_num AS buyer_phone_num, s.phone_num AS seller_phone_num, s.business_name 
                               FROM UserAccounts ua
                               LEFT JOIN Addresses a ON ua.user_id = a.user_id
                               LEFT JOIN Buyers b ON ua.user_id = b.user_id
                               LEFT JOIN Sellers s ON ua.user_id = s.user_id
                               WHERE ua.user_id = ${userId}`;
      
        if (user.length === 0) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ user: user[0] }), { status: 200 });
    } catch (error) {
        console.error('An error occurred:', error);
        return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const userId = params.id;
    const { firstName, lastName, phone, address, companyName, role } = await req.json();
    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);
  
    try {
        if (!firstName || !lastName || !phone || !address || !address.street || !address.city || !address.state || !address.postalCode) {
            throw new Error("Missing parameters");
        }
  
        const queries = [
            sql`UPDATE UserAccounts SET first_name = ${firstName}, last_name = ${lastName} WHERE user_id = ${userId};`,
            sql`UPDATE Addresses SET street = ${address.street}, city = ${address.city}, state = ${address.state}, postal_code = ${address.postalCode} WHERE user_id = ${userId};`
        ];
  
        if (role === 'seller') {
            queries.push(sql`UPDATE Sellers SET business_name = ${companyName}, phone_num = ${phone} WHERE user_id = ${userId};`);
        } else if (role === 'buyer') {
            queries.push(sql`UPDATE Buyers SET phone_num = ${phone} WHERE user_id = ${userId};`);
        }
  
        await sql.transaction(queries);
  
        return new Response(JSON.stringify({ message: "User updated successfully" }), { status: 200 });
    } catch (error) {
        console.error('An error occurred:', error);
        return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
    }
}
