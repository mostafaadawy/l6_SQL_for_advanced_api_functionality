import express, { Request, Response } from 'express'
import Authorize from '../helpers/jwtAuthorizer'
import { Product, ProductStore } from '../models/product'

const store = new ProductStore()

// handler functions here
const index = async (_req: Request, res: Response) => {
    const products = await store.index()
    res.json(products)
  }
  
  const show = async (req: Request, res: Response) => {
     const product = await store.show(req.params.id)
     res.json(product)
  }
  
  const create = async (req: Request, res: Response) => {
    try {
		Authorize(req);
	} catch (err) {
		res.status(401);
		return res.json(err);
	}  
    try {
          const p= {
              name: req.body.name as String,
              price: req.body.price as Number,
          }
          const prod = await store.create(p as Product)
          res.json(prod)
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
  
  const ProductsRoutes = (app: express.Router) => {
    app.get('/products', index)
    app.get('/products/:id', show)
    app.post('/products', create)
    app.delete('/products', destroy)
  }
  

export default ProductsRoutes