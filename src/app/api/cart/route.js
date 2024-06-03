import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  
    const requestData = await request.json();
    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);

    
}




/*async function addToCart(userId, productId) {
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
      let res = await client.query('SELECT cart_id FROM ShoppingCart WHERE user_id = $1', [userId]);
  
      let cartId;
      if (res.rows.length === 0) {
        res = await client.query('INSERT INTO ShoppingCart (user_id) VALUES ($1) RETURNING cart_id', [userId]);
        cartId = res.rows[0].cart_id;
      } else {
        cartId = res.rows[0].cart_id;
      }
  
      await client.query('INSERT INTO CartItems (cart_id, product_id, quantity) VALUES ($1, $2, 1)', [cartId, productId]);
  
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
  
  async function getCart(userId) {
    const res = await pool.query(
      'SELECT p.* FROM ShoppingCart sc ' +
      'JOIN CartItems ci ON sc.cart_id = ci.cart_id ' +
      'JOIN Products p ON ci.product_id = p.product_id ' +
      'WHERE sc.user_id = $1', [userId]);
  
    return res.rows;
  }
  */