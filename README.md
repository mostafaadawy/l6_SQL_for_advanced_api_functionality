# Lesson 6 Advanced API Functionality and Joint SQL
## 1-Introduction & Lesson Overview
## Course Progress
## What we'll do
You have created an API to power a full stack application - great job! The main goal of this course is complete. But what you have learned so far is truly just the beginning of all you can do with these skills. Right now, you can create a RESTful API that supports CRUD for all entities in the database, but what’s beyond that? In this lesson we'll explore advanced SQL queries to support a wider variety of API endpoints, we'll cover these topics:
- Database relationships
- SQL Joins
- RESTful endpoints using with joins
- RESTful endpoints with params
## Helpful Preparation
To get ready for this lesson, make sure you're comfortable with all the SQL topics we covered earlier in the course, and feel free to peruse these resources:
- Introduction to database relationships [article](https://www.lifewire.com/database-relationships-1019729) from Lifewire.
- For a visual representation of SQL joins, take a look at this [blog post](https://blog.codinghorror.com/a-visual-explanation-of-sql-joins/).

-------------------------------------------------
## 2-SQL Relationships - Has Many, Belongs to
## SQL Relationships
Database tables can be related to other tables in the database. In the SQL lesson, we used foreign keys to relate information from one table with another. We had a list of herbs, and each row on the herbs table had a column world_id that held the id of a row in the worlds table. Because of the presence of this foreign key, the herbs table is related to the worlds table and we can make more interesting queries of this relationship.

Relationships between tables take different forms, and there is some language to describe these relationships. In this section we'll discuss the different types of relationships and how to create them.
## Video Summary
In this video we went over a few different types of database relationships. Here is a summary of the types.
## Database Relationships
- ***`One to Many`***: One to many is like the relationship with plants and regions at the beginning of the course where many plants could be associated with one region by adding a foreign key on the plants tatble - the belong to side.
- ***`One to One`***: In a one-to-one relationship, one row in a table is associated with one row in another table - just one row. Where in the one to many, many plants could be associated with one region, this would be if there could only be one plant per region.
- ***`Many to Many`***: Many to many was the focus of this video and describes a more complex relationship between where rows on both tables can be associated with many rows on the other. This relationship is acheived by an intermediary table that stores each relationship as a row, this is called a join table.
Example Relationship for order_products

--------------------------------------------------------------

## 3-Creating A Cart - Models and Requests
Video Summary

This lesson shows how to create endpoints for the many to many relationship we created in the last section to give the API cart functionality.
- Nested REST routes to show relationships
--------------------------------------------------------------
## 4-Quiz: SQL Relationships
## Question 1 of 4
What is the best relationship type to describe people and pets?
- One to Many
- One to One
- (✓) Many to Many
## Question 2 of 4
What is the best relationship type to describe books and pages?
- (✓) One to Many
- One to One
- Many to Many
## Question 3 of 4
What is the best relationship type to describe recipes and ingredients?
- One to Many
- One to One
- (✓) Many to Many
## Question 4 of 4
What is the best relationship type to describe cats and tails?
- One to Many
- (✓) One to One
- Many to Many
----------------------------------------------------
## 5-Exercise: Creating A Cart
## Adding API support for cart functionality.
In this exercise you are tasked with setting up the tables, queries, models, and routes to provide basic cart functionality.
- Create the necessary tables and relationships
- Create the models (Not all CRUD actions are required for this exercise)
- Create the routes
- EXTRA: Add logic to ensure that products cannot be added to orders that are closed.
## Adding Cart Support to the API
### Getting Started
This exercise builds off of previous exercises. Migrations for the necessary tables already exist, you must add the SQL for each table including the SQL to create the many to many relationship between orders and products. Then add the model methods and handlers to expose this relationship in the API.

**`Stretch Goal`** Add logic to ensure that products can't be added to orders that are "closed" and send a 400 error to the client with a specialized message saying that the product could not be added because the order is complete.
## Environment Workspace
This exercise can be done inside of this Udacity workspace. To ready your environment follow these steps:
### In a terminal tab, create and run the database:
- switch to the postgres user su postgres
- start psql psql postgres
- in psql run the following:
    - CREATE USER full_stack_user WITH PASSWORD 'password123';
    - CREATE DATABASE full_stack_dev;
    - \c full_stack_dev
    - GRANT ALL PRIVILEGES ON DATABASE full_stack_dev TO full_stack_user;
- to test that it is working run \dt and it should output "No relations found."
## In the 2nd terminal:
Migrations to set up the database tables from the last section are included in this exercise. To run them, follow the instructions below:
- install yarn npm install yarn -g
- install db-migrate on the machine for terminal commands npm install db-migrate -g
- check node version node -v - it needs to be 10 or 12 level
- IF node was not 10 or 12 level, run
    - npm install -g n
    - n 10.18.0
    - PATH="$PATH"
    - node -v to check that the version is 10 or 12
- install all project dependencies yarn
- to run the migrations ``
- to test that it is working, run yarn watch should show an app starting on 0.0.0.0:3000
## Local Environment
If want to do this project on your local computer and you already have docker installed, there is a docker file provided for you with generic content. Note that you may need to update this file to fit your computer in order to use it locally.
### Steps to Completion
1. Plan to Meet Requirements
2. DB Creation and Migrations
3. Models
4. Express Handlers
5. JWTs
6. QA and Readme

Go to the following pages to get started on the project!

--------------------------------------------------------
## 6-Creating A Cart Exercise Solution & Review
### Part 1: SQL
I'm only going to include the up side of each migration, as the down side to drop the table is familiar to you by now.
### Products UP
```sh
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    price integer NOT NULL
);
```
### Orders UP
```sh
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(15),
    user_id bigint REFERENCES users(id)
);
```
### Order-Products UP
```sh
CREATE TABLE order_products (
    id SERIAL PRIMARY KEY,
    quantity integer,
    order_id bigint REFERENCES orders(id),
    product_id bigint REFERENCES products(id)
);
```
## Part 2: Model Method
We added the method to attach a product to and order in the order model.
```sh
  async addProduct(quantity: number, orderId: string, productId: string): Promise<Order> {
    try {
      const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'
      //@ts-ignore
      const conn = await Client.connect()

      const result = await conn
          .query(sql, [quantity, orderId, productId])

      const order = result.rows[0]

      conn.release()

      return order
    } catch (err) {
      throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`)
    }
  }
```
Notice that the model is referencing the order_products table.
### Part 3: Handler Method
```sh
const orderRoutes = (app: express.Application) => {
    app.get('/orders', index)
    app.get('/orders/:id', show)
    app.post('/orders', create)
    // add product
    app.post('/orders/:id/products', addProduct)
}

// ... other methods
const addProduct = async (_req: Request, res: Response) => {
  const orderId: string = _req.params.id
  const productId: string = _req.body.productId
  const quantity: number = parseInt(_req.body.quantity)

  try {
    const addedProduct = await store.addProduct(quantity, orderId, productId)
    res.json(addedProduct)
  } catch(err) {
    res.status(400)
    res.json(err)
  }
} 
```
Notice the nesting of the REST routes with addProduct. We can show how the product belongs to a single order. If we were to add a user as an owner of the order, we might do something like this:
```sh
/users/:userID/orders/:orderID/products
```
### Extra Challenge
Where would be the best place to add the logic for making sure the order is open and can have new products added to it? In a real application, I would actually create a layer of files between handlers and models to hold business logic like this, because we will quickly overburden our handlers or models with this kind of logic. But for this exercise and with how small this application is, I would add it to the model. Here is ### a quick example:
```sh
async addProduct(quantity: number, orderId: string, productId: string): Promise<Order> {
    // get order to see if it is open
    try {
      const ordersql = 'SELECT * FROM orders WHERE id=($1)'
      //@ts-ignore
      const conn = await Client.connect()

      const result = await conn.query(ordersql, [orderId])

      const order = result.rows[0]

      if (order.status !== "open") {
        throw new Error(`Could not add product ${productId} to order ${orderId} because order status is ${order.status}`)
      }

      conn.release()
    } catch (err) {
      throw new Error(`${err}`)
    }

    try {
      const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'
      //@ts-ignore
      const conn = await Client.connect()

      const result = await conn
          .query(sql, [quantity, orderId, productId])

      const order = result.rows[0]

      conn.release()

      return order
    } catch (err) {
      throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`)
    }
  }
```
--------------------------------------------------------------
## 7-More SQL: Sorting and Joins
### SQL commands for sorting
There are a few more SQL commands that will really come in handy, all of these are for ordering the responses you get back from a query.
### Order By, Ascending, and Descending

These commands allow you to order responses alphabetically or by a number. First, you choose the column that you want to use to order the rows, then you can choose the direction - ascending or descending. Here's an example:
```sh
SELECT * FROM products ORDER BY price DESC;
```
This query would get you all rows and columns from the products table. We have chosen to use the price column as the piece of information we want to order by, and chosen DESC as the direction, so the response we see will be a list of all products where products with the highest prices would come first and get smaller as you scrolled down the list.
```sh
SELECT * FROM users ORDER BY name ASC;
```
Same thing but with alphabetical order instead of numerical. This query would get all the rows and columns from the users table, and sort the rows by name starting with A and going up to Z.
### SQL Joins
### Video Summary
This video explains and implements an inner join in psql.
Example join syntax:
```sh
SELECT * FROM products INNER JOIN order_products ON product.id = order_products.id;
```
-----------------------------------------------------
### 8-Quiz: Sorting and Joins Quiz
### Question 1 of 3
Is this a valid SQL query? 
```sh
SELECT * FROM plant_sightings INNER JOIN users ON users.id = plant_sightings.user_id;
```
- False
- (✓) True
### Question 2 of 3
Which of the following are true of joins:
- (✓) There must be a common piece of information between two tables to join on
- The two tables being joined cannot be a part of a many to many relationship
- The result of a join can display columns only from the first table declared in the join
- The result of a join can display columns only from the second table declared in the join
- (✓) The result of a join can display columns from either or both tables declared in the join
### Question 3 of 3
This query would display the resulting rows in what order? 
```sh
SELECT age, name, id FROM users ORDER BY age DESC;
```
- All columns on users, ordered by age, youngest users first
- All columns on users, ordered by age, oldest users first
- Columns age, name, and id on users, ordered by age, youngest users first
- (✓) Columns age, name, and id on users, ordered by age, oldest users first

-------------------------------------------------------------

## 9-Exercise: SQL Joins
Now its your turn to write a SQL join! Migrations for the previous tables are provided in this project. Your task is to write a join that will find all users who have created orders. You will need to test this query and add the rows in each database via psql since there is no web interface.

### Readne Adding a SQL join to the API
### Getting Started
This exercise builds off of previous exercises. Migrations for the previous tables are provided in this project. Your task is to write a join that will find all users who have created orders. You will need to test this query and add the rows in each database via psql since there is no web interface.
### Environment Workspace
This exercise can be done inside of this Udacity workspace. To ready your environment follow these steps:
In a terminal tab, create and run the database:
- switch to the postgres user su postgres
- start psql psql postgres
- in psql run the following:
    - CREATE USER full_stack_user WITH PASSWORD 'password123';
    - CREATE DATABASE full_stack_dev;
    - \c full_stack_dev
    - GRANT ALL PRIVILEGES ON DATABASE full_stack_dev TO full_stack_user;
- to test that it is working run \dt and it should output "No relations found."
### In the 2nd terminal:
Migrations to set up the database tables from the last section are included in this exercise. To run them, follow the instructions below:
- install yarn npm install yarn -g
- install db-migrate on the machine for terminal commands npm install db-migrate -g
- check node version node -v - it needs to be 10 or 12 level
- IF node was not 10 or 12 level, run
    - npm install -g n
    - n 10.18.0
    - PATH="$PATH"
    - node -v to check that the version is 10 or 12
- install all project dependencies yarn
- to run the migrations ``
- to test that it is working, run yarn watch should show an app starting on 0.0.0.0:3000
### Local Environment
If want to do this project on your local computer and you already have docker installed, there is a docker file provided for you with generic content. Note that you may need to update this file to fit your computer in order to use it locally.
Steps to Completion
1. Plan to Meet Requirements
2. DB Creation and Migrations
3. Models
4. Express Handlers
5. JWTs
6. QA and Readme

Go to the following pages to get started on the project!

----------------------------------------------------
## 10-SQL Joins Exercise Solution & Review
Here is a join that would fulfill the requirements of this exercise:
```sh
SELECT * FROM users INNER JOIN orders ON users.id = orders.user_id;
```
How did we get to this solution? We know that the orders table records the id of the user creating the order in the user_id column. If a user has ever made an order, their id has been recorded in the orders table as the the user_id of an order. So, this join looks for all user ids that show up in both of those tables to find the users who have made orders.

-----------------------------------------------------------------
## 11-Create a Dashboard Endpoint
## API Routes for Dashboards
The API routes we have looked at so far in this course have all been around action - CRUD actions. But that isn't always the case, sometimes a web app might just want specialized information from our API. An easy example of when this might be useful is for creating a dashboard page for admin or for a user profile in a front end application.

Here is a copy of the SQL Join that I created in the last section:
```sh
SELECT * FROM products INNER JOIN order_products ON product.id = order_products.id;
```
the question now is ... what model/handler should this query belong with? Being a join, it involves two tables, and not in a belongs-to relationship like orders and products. Even harder is that one of these tables is a Join table and not associated with a model. So what should we do?
### Quiz Question
Given what you know so far in the course, take a guess of what you think would be a good option for adding this join query to the API
- Add it to the products model/handler
- Create an order-products model/handler and add it there
- Create a model/handler set called <code>misc</code> for all of these queries that don't fit anywhere else 
- (✓) There must be a better solution we haven't talked about yet...
## Creating a Service
At this point, I would say that our needs for this application have grown beyond our simple model - handler architecture. It would not make sense to cram this query onto the products table, or any of the other options discussed above. This `JOIN` query is **business logic that does not belong in any model or handler**, so we are going to put it in a new place, called a service.

I will add a `services` folder as a sibling of models and handlers. Services will have a file called `dashboard.ts`. Here, we can add various methods that get information from the database in the form of specialized select queries or joins. One thing is very important - the dashboard will run SQL queries to **READ** information from the database, but **any actions on the database should be done through a model**. This dashboard file is simply allowing us to isolate our informational queries together in one place, rather than spread them out across all the models. Since what information is shown in the dashboard is likely to change often, this will cut down time to edit dashboard queries when needed. This also fits conceptually, because a model is supposed to be the representation of your database table in the Node application, it should not be concerned with getting the 5 most recently added products, for example.
`A service file is a place to write extra business logic that does not belong in a handler or a model or orchestrates changes with multiple models`. For another example, as the complexity of our logic for authorizing which users can see various pages grows, the logic to check JWTs for authorization rights would become its own service as well.
### The Code
### src/services/dashboard.ts --> orderedProducts
```sh
import Client from '../database'

export class DashboardQueries {
  // Get all products that have been included in orders
  async productsInOrders(): Promise<{name: string, price: number, order_id: string}[]> {
    try {
      //@ts-ignore
      const conn = await Client.connect()
      const sql = 'SELECT name, price, order_id FROM products INNER JOIN order_products ON product.id = order_products.id'

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`unable get products and orders: ${err}`)
    } 
  }
}
```
Things to note from this:
- We import the database client and create a connection in the method just like a model, because this service is running queries on the database, they will just be READ-ONLY queries, instead of updating tables, so this is ok.
- productsInOrders - sometimes, it is really hard to give a method a clear name, especially in situations like this. If you can't find a name that describes precisely what is going on, leave a comment like I did to explain what the name fails to convey.
- Notice the return type from this typescript method -- it isn't a product, an order, or any other type we created in the models. This is another sign that we were right to put this method away in its own service rather than in products, it is returning a hybrid of two tables, and that would be messy to implement in any model file.
### Now for the handler
We will create a separate handler file for these methods.
```sh
import express, { Request, Response } from 'express'

import { DashboardQueries } from '../services/dashboard'

const dashboardRoutes = (app: express.Application) => {
    app.get('/products_in_orders', productsInOrders)
}

const dashboard = new DashboardQueries()

const productsInOrders = async (_req: Request, res: Response) => {
  const products = await dashboard.productsInOrders()
  res.json(products)
}

export default dashboardRoutes
```
### Things to note here:
- This looks mostly like any other handler we created, but we aren't importing a model type, instead we are importing dashboard from services.
- RESTful routes are great for describing actions taken through the API, but they begin to break down for informational routes like this. Most of this comes down to personal preference, but I try to stick with REST as long as I can, and then name routes in the most descriptive way I can think of, and leave comments. A good pattern for naming these routes in your application may emerge as you build out more of them, so pay attention situationally to what the best options are for naming your routes.

--------------------------------------------------------------------
## 11-Exercise: Create a Dashboard Endpoint
## Dashboard Endpoint
In this exercise you will take two SQL queries and write the model and handler methods to add them to the API
- Write a SQL query that uses a join (this can be the users/orders join you created in the last exercise, or a new one)
- Write a SQL query that gets the 5 most expensive products
- Add the services folder and dashboard file
- Add a handler file for the dashboard routes
## Read Dashboard Endpoints
This exercise builds off of previous exercises. Migrations for the previous tables are provided in this project. Your task is to write the SQL queries from the tasklist above and add them to the dashboard service.
## EnvironmentWorkspace
This exercise can be done inside of this Udacity workspace. To ready your environment follow these steps:
### In a terminal tab, create and run the database:
- switch to the postgres user su postgres
- start psql psql postgres
- in psql run the following:
    - CREATE USER full_stack_user WITH PASSWORD 'password123';
    - CREATE DATABASE full_stack_dev;
    - \c full_stack_dev
    - GRANT ALL PRIVILEGES ON DATABASE full_stack_dev TO full_stack_user;
- to test that it is working run \dt and it should output "No relations found."
### In the 2nd terminal:
Migrations to set up the database tables from the last section are included in this exercise. To run them, follow the instructions below:
- install yarn npm install yarn -g
- install db-migrate on the machine for terminal commands npm install db-migrate -g
- check node version node -v - it needs to be 10 or 12 level
- IF node was not 10 or 12 level, run
    - npm install -g n
    - n 10.18.0
    - PATH="$PATH"
    -node -v to check that the version is 10 or 12
- install all project dependencies yarn
- to run the migrations ``
- to test that it is working, run yarn watch should show an app starting on 0.0.0.0:3000
## Local Environment
If want to do this project on your local computer and you already have docker installed, there is a docker file provided for you with generic content. Note that you may need to update this file to fit your computer in order to use it locally.
Steps to Completion
1. Plan to Meet Requirements
2. DB Creation and Migrations
3. Models
4. Express Handlers
5. JWTs
6. QA and Readme

Go to the following pages to get started on the project!

--------------------------------------------------------------------
## 13-Dashboard Endpoint Exercise Solution & Review
1. **Adding the Join**
For this solution I will use the SQL JOIN you created in the last exercise as an example, but if you created a new one just apply these principles to your own work.
### SQL Join:
```sh
SELECT * FROM users INNER JOIN orders ON users.id = orders.user_id;
```
### The Dashboard service:
```sh
import Client from '../database'

export class DashboardQueries {
  // Get all users that have made orders
  async usersWithOrders(): Promise<{firstName: string, lastName: string}[]> {
    try {
      //@ts-ignore
      const conn = await Client.connect()
      const sql = 'SELECT first_name, last_name FROM users INNER JOIN orders ON users.id = orders.user_id'

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`unable get users with orders: ${err}`)
    } 
  }
```
### Dashboard Route Handlers:
```sh
import express, { Request, Response } from 'express'

import { DashboardQueries } from '../services/dashboard'

const dashboardRoutes = (app: express.Application) => {
    app.get('/products-in-orders', productsInOrders)
    app.get('/users-with-orders', usersWithOrders)
}

const dashboard = new DashboardQueries()

const usersWithOrders = async (_req: Request, res: Response) => {
  const users = await dashboard.usersWithOrders()
  res.json(users)
}

const productsInOrders = async (_req: Request, res: Response) => {
  const products = await dashboard.productsInOrders()
  res.json(products)
}

export default dashboardRoutes
```
2. **Adding the ORDER By**
For this solution I will use the following ORDER BY query to get the 5 most expensive products:
```sh
SELECT name, price FROM products ORDER BY price DESC LIMIT 5;
```
### Dashboard Service Method
```sh
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
```
### Handler Method
```sh
import express, { Request, Response } from 'express'

import { DashboardQueries } from '../services/dashboard'

const dashboardRoutes = (app: express.Application) => {
    app.get('/five-most-expensive', fiveMostExpensive)
    app.get('/products-in-orders', productsInOrders)
    app.get('/users-with-orders', usersWithOrders)
}

const dashboard = new DashboardQueries()

const fiveMostExpensive = async (_req: Request, res: Response) => {
  const users = await dashboard.fiveMostExpensive()
  res.json(users)
}

const usersWithOrders = async (_req: Request, res: Response) => {
  const users = await dashboard.usersWithOrders()
  res.json(users)
}

const productsInOrders = async (_req: Request, res: Response) => {
  const products = await dashboard.productsInOrders()
  res.json(products)
}

export default dashboardRoutes
```

---------------------------------------------------------
## 14-Lesson Conclusion
Well done! In this lesson we've uncovered more SQL goodness and followed through to how those more advanced queries can power new endpoints for our API:
- Database relationships
- SQL Joins
- RESTful endpoints using joins and relationships

### Going Further:
- A good [reference](https://www.dofactory.com/sql/left-outer-join) for join syntax fro9m DoFactory.
- A cool [tool](https://sql-joins.leopard.in.ua/) for visualizing SQL joins with syntax.
- Another [tool](https://blog.codinghorror.com/a-visual-explanation-of-sql-joins/) for visualizing SQL joins syntax for good measure.
- A [resource](https://www.moesif.com/blog/technical/api-design/REST-API-Design-Best-Practices-for-Sub-and-Nested-Resources/) for nested REST routes.
- Another [resource](https://docs.universaldashboard.io/rest-apis) for deep diving into REST route

--------------------------------------------------------------
## 15-Course Conclusion
### Course Overview
Well done! I hope you've enjoyed the course and that you feel good about the skills and concepts you've learned here. The video below is a recap of all we've done and covered, take a moment to review your accomplishments!
### Course Project: Shopping API
You are now ready for the project! In the project for this course, you will be dropped into a workplace scenario where you and a developer co-worker are tasked with creating a shopping website. Your job is to work as the API engineer on this project and build a RESTful JSON API to meet the requirements set by stakeholders and the front end end developer. Watch the video below for an introduction to the project, its requirements and set up.

------------------------------------------------------
