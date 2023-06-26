import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import ProductsRoute from "./routes/ProductsRoute.js"
dotenv.config()

const port = process.env.APP_PORT

const app = express()

app.use(cors())
app.use(express.json())
app.use(ProductsRoute)


app.get('/', (req, res) => {
  res.send('e-textile api server')
})

app.listen(port, () => {
  console.log(`server running on ${port}`)
})