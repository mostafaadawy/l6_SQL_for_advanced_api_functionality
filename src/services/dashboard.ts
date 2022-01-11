//@ts-ignore
import Client from '../database'

export class DashboardQueries {
  // Get all products that have been included in orders
  async productsInOrders(): Promise<{name: string, price: number, order_id: string}[]> {
    try {
      //@ts-ignore
      const conn = await Client.connect()
      const sql = 'SELECT name, price, order_id FROM products INNER JOIN order_products ON products.id = order_products.id'

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`unable get products and orders: ${err}`)
    } 
  }
// Get all users that have made orders
async fiveMostExpensive(): Promise<{name: string, price: number}[]> {
  try {
    //@ts-ignore
    const conn = await Client.connect()
    const sql = 'SELECT name, price FROM products ORDER BY price DESC LIMIT 5'

    const result = await conn.query(sql)

    conn.release()

    return result.rows
  } catch (err) {
    throw new Error(`unable get products by price: ${err}`)
  } 
}
// Get all users that have made orders
async usersWithOrders(): Promise<{firstname: string, lastname: number}[]> {
  try {
    //@ts-ignore
    const conn = await Client.connect()
    const sql = 'SELECT firstname, lastname FROM users ORDER BY id DESC LIMIT 5'

    const result = await conn.query(sql)

    conn.release()

    return result.rows
  } catch (err) {
    throw new Error(`unable get users by id: ${err}`)
  } 
}

}