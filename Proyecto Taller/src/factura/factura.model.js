'use strict'

import { Schema, model } from 'mongoose'

const facturaSchema = Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'user',
        required: true
    },
    buy: {
        type: Schema.ObjectId,
        ref: 'buy',
        required: true
    },
    products:[{
        type: Schema.Types.Mixed,
        required: true
    }],
    totalP:{
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
},{
    versionKey: false
})

export default model('factura', facturaSchema)