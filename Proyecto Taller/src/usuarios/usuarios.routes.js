'use strict'

import  express  from "express"
import { deleteU, historial, login, register, serAdmin, updateUser } from "./usuarios.controller.js"
import { isAdmin, isClient, validateJwt } from "../middlewares/validate-jwt.js"

const api = express.Router()

api.post('/register',register)
api.post('/login',login)
api.put('/update/:id',[validateJwt],updateUser)
api.delete('/delete/:id',[validateJwt],deleteU)
api.get('/historial/:idU',[validateJwt, isClient],historial)
api.post('/serAdmin/:id',[validateJwt, isAdmin],serAdmin)

export default api