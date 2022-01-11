import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
//import routes from './routes'
import articleRoutes from './handlers/article'
import UsersRoutes from './handlers/user'
import ProductsRoutes from './handlers/product'
import OrdersRoutes from './handlers/order'
import OrderProductRoutes from './handlers/order_product'
import dashboardRoutes from './handlers/dashboard'
const app: express.Application = express()
const address: string = "localhost:3000"

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())
app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
})

articleRoutes(app)
UsersRoutes(app)
ProductsRoutes(app)
OrdersRoutes(app)
OrderProductRoutes(app)
dashboardRoutes(app)
app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
})
