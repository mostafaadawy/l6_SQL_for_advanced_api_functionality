import express, { Request, Response } from 'express'
import Authorize from '../helpers/jwtAuthorizer'
import { Book, BookStore } from '../models/book'

const store = new BookStore()

// handler functions here
const index = async (_req: Request, res: Response) => {
    const books = await store.index()
    res.json(books)
  }
  
  const show = async (req: Request, res: Response) => {
     const book = await store.show(req.params.id)
     res.json(book)
  }
  
  const create = async (req: Request, res: Response) => {
    try {
		Authorize(req);
	} catch (err) {
		res.status(401);
		return res.json(err);
	}       
  try {
      const b= {
          title: req.body.title as String,
          author: req.body.author as String,
          total_pages: req.body.total_pages as Number,
          summary: req.body.summary as String 
      } as Book
      const newArticle = await store.create(b)
      res.json(newArticle)
  } catch(err) {
      res.status(400)
      res.json(err)
    }
  }
  const destroy = async (req: Request, res: Response) => {
    try {
		Authorize(req);
	} catch (err) {
		res.status(401);
		return res.json(err);
	}  
      const deleted = await store.delete(req.body.id)
      res.json(deleted)
  }
  
  const articleRoutes = (app: express.Router) => {
    app.get('/books', index)
    app.get('/books/:id', show)
    app.post('/books', create)
    app.delete('/books', destroy)
  }
  

export default articleRoutes