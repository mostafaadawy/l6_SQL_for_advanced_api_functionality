// @ts-ignore
import Client from '../database'

export type Article = {
  id?: string;
  title: string;
  content: Text;
}

export class ArticleStore {
  async index(): Promise<Article[]> {
    try {
      // @ts-ignore
      const conn = await Client.connect()
      const sql = 'SELECT * FROM articles'
      const result = await conn.query(sql)
      conn.release()
      console.log("index visited")
      return result.rows 
    } catch (err) {
      throw new Error(`Could not get articles. Error: ${err}`)
    }
  }

  async show(id: string): Promise<Article> {
    try {
    const sql = 'SELECT * FROM articles WHERE id=($1)'
    // @ts-ignore
    const conn = await Client.connect()
    const result = await conn.query(sql, [id])
    conn.release()
    console.log("show visited")
    return result.rows[0]
    } catch (err) {
        throw new Error(`Could not find article ${id}. Error: ${err}`)
    }
  }

  async create(a: Article): Promise<Article> {
      try {
        //@ts-ignore
        const conn = await Client.connect()
        const sql = 'INSERT INTO articles (title, content) VALUES ($1,$2) RETURNING *'
        console.log(a)
        const result = await conn.query(sql, [a.title,a.content])
        const art = result.rows[0]
        conn.release()
        return art
      } catch (err) {
          console.log(err)
          throw new Error(`Could not add new article ${a.title}. Error: ${err}`)
      }
  }

  async delete(id: string): Promise<Article> {
      try {
    const sql = 'DELETE FROM articles WHERE id=($1)'
    // @ts-ignore
    const conn = await Client.connect()
    const result = await conn.query(sql, [id])
    const article = result.rows[0]
    conn.release()
    console.log("delete visited")
    return article
      } catch (err) {
          throw new Error(`Could not delete an article ${id}. Error: ${err}`)
      }
  }
}