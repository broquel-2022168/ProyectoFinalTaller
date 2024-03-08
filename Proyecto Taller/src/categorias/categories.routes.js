'use strict'

import express from "express"
import { deleteC, getC, save, updateC } from "./categories.controller.js"

const api = express.Router()

api.post('/save',save)
api.put('/update/:id',updateC)
api.delete('/delete/:id',deleteC)
api.get('/get',getC)

export default api