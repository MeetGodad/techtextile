// https://chatgpt.com/c/22e9babf-91d6-4e67-8e17-d8393610f4f2 for this database taken a help 
import { neon } from '@neondatabase/serverless';


export async function POST(req) {

    try {
        const requestData = await req.json();

        const databaseUrl = process.env.DATABASE_URL || "";
        const sql = neon(databaseUrl);

        const review = await sql`
            INSERT INTO Feedback (
            user_id,
            product_id,
            feedback_heading,
            feedback_text,
            feedback_rating
            ) VALUES (
            ${requestData.user_id}, 
            ${requestData.product_id},
            ${requestData.feedback_heading},
            ${requestData.feedback_text},
            ${requestData.feedback_rating}
            ) 
            RETURNING feedback_id;`;
        
         if(review.length === 0){
            return new Response(JSON.stringify({ message: "Review not found" }), { status: 404 });
         }

         return new Response(JSON.stringify({message: "Review found", review: review[0]}))
         } catch (error) {
        console.error('An error occurred: Internal server error', error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
        }

    }
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('product_id');

        if (!productId) {
            return new Response(JSON.stringify({ message: "Product ID is required" }), { status: 400 });
        }

        const databaseUrl = process.env.DATABASE_URL || "";
        const sql = neon(databaseUrl);

        const reviews = await sql`
            SELECT F.user_id, F.feedback_heading, F.feedback_text, F.feedback_rating, U.first_name, U.last_name 
            FROM feedback F
            JOIN useraccounts U ON F.user_id = U.user_id
            WHERE F.product_id = ${productId}`;

        return new Response(JSON.stringify(reviews), { status: 200 });
    } catch (error) {
        console.error('An error occurred: Internal server error', error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}
