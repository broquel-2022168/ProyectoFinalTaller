'use strict'

import Cart from './cart.model.js'
import Product from '../productos/productos.model.js'
import User from '../usuarios/usuarios.model.js'

export const addCart = async(req, res) =>{
    try {
        let { id } = req.params
        let data = req.body
        let user = await User.findById(id)
        if(!user) return res.status(404).send({message: 'User not found'})
        let product = await Product.findById(data.product)
        if(!product) return res.status({message: 'product not found'})
        let userCart = await Cart.findOne({user : id})
    

        if(!userCart){
            let subtotal = product.price

            let cart1 = {
                user: id,
                products: data.product,
                subtotal : subtotal,
                total : subtotal
            }
            let newCart = new Cart(cart1)

            await newCart.save()

            return res.send({message: 'Product save succsessfully'})

            /*console.log(product.price)
            userCart = await Cart.create({user: id, products: product._id, subtotal: product.price, total: product.price})
            return res.send({message: 'Product add successfully1'})
            */
        }
        
        let subt 

        subt = userCart.subtotal + product.price

        
        userCart.products.push(data.product)
        userCart.subtotal = subt
        userCart.total = subt
        await userCart.save()

        return res.send({message: 'Product added successfully in your car'})
        
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error saving product with your car'})
    }
}