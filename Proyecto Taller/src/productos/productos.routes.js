'use strict'

import express from 'express'
import { deletProduct, getAll, getById, masVendido, porductsOut, saveP, searchByCategory, searchByname, updateP } from './productos.controller.js'
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js'

const api = express.Router()

api.post('/saveProduct',[validateJwt, isAdmin],saveP)
api.get('/getAll',[validateJwt],getAll)
api.get('/getById/:id',[validateJwt],getById)
api.put('/updateProduct/:id',[validateJwt, isAdmin],updateP)
api.get('/productsOut',[validateJwt, isAdmin],porductsOut)
api.delete('/deleteProduct/:id',[validateJwt, isAdmin],deletProduct)
api.get('/catalogCategory/:idC',[validateJwt],searchByCategory)
api.get('/searchByname',[validateJwt],searchByname)
api.get('/productosMas',[validateJwt],masVendido)

export default api