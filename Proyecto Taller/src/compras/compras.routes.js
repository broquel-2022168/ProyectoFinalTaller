'use strict'

import express from 'express'
import { newBuy } from './compras.controller.js'
import { isClient, validateJwt } from '../middlewares/validate-jwt.js'

const api = express.Router()

api.post('/newBuy/:id',[validateJwt, isClient],newBuy)

export default api