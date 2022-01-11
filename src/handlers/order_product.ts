import express, { Request, Response } from 'express'
import Authorize from '../helpers/jwtAuthorizer'
import { ORDERPRODUCT, OrderProductStore } from '../models/order_product'

const store = new OrderProductStore()
// ... other methods
const addProduct = async (_req: Request, res: Response) => {
  const orderId: string = _req.params.id
  const productId: string = _req.body.product_id
  const quantity: number = parseInt(_req.body.quantity)

  try {
    
    console.log({orderId, productId, quantity})
    const addedProduct = await store.addProduct(quantity, orderId, productId)
    res.json(addedProduct)
  } catch(err) {
    res.status(400)
    res.json(err)
  }
} 




// // handler functions here
// const index = async (_req: Request, res: Response) => {
//     const articles = await store.index()
//     res.json(articles)
//   }
  
//   const show = async (req: Request, res: Response) => {
//      const article = await store.show(req.params.id)
//      res.json(article)
//   }
  
//   const create = async (req: Request, res: Response) => {
//     try {
// 		Authorize(req);
// 	} catch (err) {
// 		res.status(401);
// 		return res.json(err);
// 	}  
    
    
//     try {
//           const a= {
//               title: req.body.title,
//               content: req.body.content,
//           }
//           const newArticle = await store.create(a)
//           res.json(newArticle)
//       } catch(err) {
//           res.status(400)
//           res.json(err)
//       }
//   }
  
//   const destroy = async (req: Request, res: Response) => {
//     try {
// 		Authorize(req);
// 	} catch (err) {
// 		res.status(401);
// 		return res.json(err);
// 	}  
//       const deleted = await store.delete(req.body.id)
//       res.json(deleted)
//   }
  
  const orderProductRoutes = (app: express.Router) => {
    // app.get('/order_products', index)
    // app.get('/order_products/:id', show)
    // app.post('/order_products', create)
    // app.delete('/order_products', destroy)
    // add product
    app.post('/orders/:id/products', addProduct)
  }
  

export default orderProductRoutes