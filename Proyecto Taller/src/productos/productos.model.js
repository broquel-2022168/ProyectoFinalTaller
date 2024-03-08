'use strict'

import { Schema, model } from 'mongoose'

const productSchema = Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category:{
        type: Schema.ObjectId,
        ref: 'category',
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    ventas:{
        type: Number,
        required: false
    }
},{
    versionKey: false
})

export default model('product', productSchema)