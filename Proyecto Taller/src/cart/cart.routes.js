'use strict'

import express from 'express'
import { addCart } from './cart.controller.js'
import { isClient, validateJwt } from '../middlewares/validate-jwt.js'

const api = express.Router()

api.post('/addProduct/:id',[validateJwt, isClient],addCart)

export default api