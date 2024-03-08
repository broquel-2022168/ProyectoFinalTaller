'use strict'

import { Schema, model } from 'mongoose'

const buySchema = Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'user',
        required: true
    },
    cart:{
        type: Schema.ObjectId,
        ref: 'cart',
        required: true
    },
    pagoTotal:{
        type: Number,
        required: true
    }
},{
    versionKey: false
})

export default model('buy',buySchema)