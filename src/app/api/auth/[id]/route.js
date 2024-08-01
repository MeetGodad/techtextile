import { neon } from '@neondatabase/serverless';

const getDatabaseErrorMessage = (errorCode) => {
  const errorMessages = {
    '23505': 'A record with this identifier already exists.', // Unique violation
    '23503': 'A foreign key constraint fails.', // Foreign key violation
    // Add more error codes and messages as needed
    'default': 'An unexpected database error occurred. Please try again.'
  };
  return errorMessages[errorCode] || errorMessages['default'];
};

export async function GET(req, { params }) {
  const databaseUrl = process.env.DATABASE_URL || "";
  const sql = neon(databaseUrl);

  try {
    const id = params.id;
    console.log("User ID:", id);

    const response = await sql`SELECT * FROM useraccounts WHERE user_id = ${id};`;

    if (response.length === 0) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "User found", user: response[0] }), { status: 200 });
  } catch (error) {
    console.error('An error occurred:', error);
    const errorMessage = getDatabaseErrorMessage(error.code);
    return new Response(JSON.stringify({ message: errorMessage, error: error.message }), { status: 500 });
  }
}