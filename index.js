import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import ProductsRoute from "./routes/ProductsRoute.js"
import UserRoute from "./routes/UserRoute.js"
import cookieParser from 'cookie-parser'
dotenv.config()

const port = process.env.APP_PORT

const app = express()

app.use(cors({credentials:true, origin:'http://localhost:3000'}))
app.use(cookieParser())
app.use(express.json())
app.use(ProductsRoute)
app.use('/api/v1', UserRoute);

app.get('/', (req, res) => {
  res.send('e-textile api server')
})

app.listen(port, () => {
  console.log(`server running on ${port}`)
})