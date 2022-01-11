import express, { Request, Response } from 'express'
import Authorize from '../helpers/jwtAuthorizer'
import { Order, OrderStore } from '../models/order'

const store = new OrderStore()

// handler functions here
const index = async (_req: Request, res: Response) => {
    console.log("order index")
    const orders = await store.index()
    res.json(orders)
  }
  
  const show = async (req: Request, res: Response) => {
     const order = await store.show(req.params.id)
     res.json(order)
  }
  
  const create = async (req: Request, res: Response) => {
    try {
		  Authorize(req);
    } catch (err) {
      res.status(401);
      return res.json(err);
    }  
    try {
      const o= {
        status: req.body.status as String,
        user_id: req.body.user_id as Number,
        product_id: req.body.product_id as Number
        }
        const ord = await store.create(o as Order)
        res.json(ord)
      } catch(err) {
        console.log(err)
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
  
  const OrdersRoutes = (app: express.Router) => {
    app.get('/orders', index)
    app.get('/orders/:id', show)
    app.post('/orders', create)
    app.delete('/orders', destroy)
  }
  

export default OrdersRoutes