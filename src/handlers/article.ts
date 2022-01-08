import express, { Request, Response } from 'express'
import Authorize from '../helpers/jwtAuthorizer'
import { Article, ArticleStore } from '../models/article'

const store = new ArticleStore()

// handler functions here
const index = async (_req: Request, res: Response) => {
    const articles = await store.index()
    res.json(articles)
  }
  
  const show = async (req: Request, res: Response) => {
     const article = await store.show(req.params.id)
     res.json(article)
  }
  
  const create = async (req: Request, res: Response) => {
    try {
		Authorize(req);
	} catch (err) {
		res.status(401);
		return res.json(err);
	}  
    
    
    try {
          const a= {
              title: req.body.title,
              content: req.body.content,
          }
          const newArticle = await store.create(a)
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
    app.get('/articles', index)
    app.get('/articles/:id', show)
    app.post('/articles', create)
    app.delete('/articles', destroy)
  }
  

export default articleRoutes