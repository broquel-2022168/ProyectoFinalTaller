import express  from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { config } from 'dotenv'
import userRoutes from '../src/usuarios/usuarios.routes.js'
import categoryRoutes from '../src/categorias/categories.routes.js'
import productRoutes from '../src/productos/productos.routes.js'
import cartRoutes from '../src/cart/cart.routes.js'
import buyRoutes from '../src/compras/compras.routes.js'
import facturaRoutes from '../src/factura/factura.routes.js'

const app = express()
config()
const port = process.env.PORT || 3200

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(userRoutes)
app.use('/category',categoryRoutes)
app.use('/product',productRoutes)
app.use('/cart',cartRoutes)
app.use('/buy',buyRoutes)
app.use('/factura',facturaRoutes)

export const initServer = () =>{
    app.listen(port)
    console.log(`Server HTTP running in port: ${port}`)
}