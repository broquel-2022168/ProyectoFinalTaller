'use strict'

import Product from './productos.model.js'

export const saveP = async(req, res)=>{
    try {
        let data = req.body
        data.ventas = 0
        let product = new Product(data)
        await product.save()
        return res.send({message: 'Product saved successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error saving product'})
    }
}

export const getAll = async(req, res) =>{
    try {
        let products = await Product.find()
        if(!products.length === 0) return res.status(404).send({message: 'Products not found'})
        return res.send({products})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error getting products'})
    }
}

export const getById =async(req, res) =>{
    try {
        let { id } = req.params
        let product = await Product.findById(id)
        if(!product) return res.status(404).send({message: 'Product not found'})
        return res.send({product})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error getting product'})
    }
}

export const updateP = async(req, res)=>{
    try {
        let { id } = req.params
        let data = req.body
        let product = await Product.findById(id)
        if(!product) return res.status(404).send({message: 'Product not found and not update'})
        let updateProduct = await Product.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}    
        )
        return res.send({message: 'Producto updating successfully', updateProduct})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error updating product'})
    }
}

export const porductsOut = async(req, res)=>{
    try {
        let productOut = await Product.find({ stock: 0 })
        if(!productOut) return res.send({message: 'No hay productos agotados, nadie los quiere :('})
        return res.send({productOut})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error getting products out of the stock'})
    }
}

export const deletProduct = async(req, res)=>{
    try {
        let { id } = req.params
        let product = await Product.findById(id)
        if(!product) return res.status(404).send({message: 'Product not found and not update'})
        let deletedProduct = await Product.findOneAndDelete({_id: id})
        return res.send({message: `Product ${deletProduct} deleted successfully `})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error deleting product'})
    }
}

export const searchByCategory = async(req, res)=>{
    try {
        let { idC } = req.params
        let products = await Product.find({category : idC})
        if(!products) return res.status(404).send({message: 'Products not found'})
        return res.send({products})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error getting users by category'})
    }
} 

export const searchByname = async(req, res)=>{
    try {
        let { name } = req.body
        let product = await Product.find({name:  name})
        if(!product) return res.status(404).send({message: 'Product not found'})
        return res.send({product})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error to search product'})
    }
}

export const masVendido = async(req, res)=>{
    try {
        let productsMas = await Product.find()
        .sort({ ventas: -1 }) // Ordenar por cantidad de ventas de forma descendente
            .limit(10); // Obtener los primeros 10 productos más vendidos

        return res.send({productsMas})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error getting producto most sales XD no sé ingles del todo'})
    }
}