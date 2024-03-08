'use strict'

import express from 'express'
import {  newFact, generatePDFInvoice } from './factura.controller.js'
import { isAdmin, isClient, validateJwt } from '../middlewares/validate-jwt.js'

const api = express.Router()

api.post('/generate/:idB',[validateJwt],newFact)
api.get('/generatePDF/:idF',[validateJwt], generatePDFInvoice);

export default api