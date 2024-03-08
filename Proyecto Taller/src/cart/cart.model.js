'use strict'

import { Schema, model } from 'mongoose'

const cartSchema = Schema({
    user:{
        type: Schema.ObjectId,
        ref: 'user',
        required: true
    },
    products:[{
        type: Schema.ObjectId,
        ref: 'product',
        required: true
    }],
    subtotal:{
        type: Number,
        required: true
    },
    total:{
        type: Number,
        required: true
    }
},{
    versionKey: false
})

export default model('cart',cartSchema)