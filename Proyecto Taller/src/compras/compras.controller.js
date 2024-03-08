'use strict'

import Buy from './compras.model.js'
import Cart from '../cart/cart.model.js'
import User from '../usuarios/usuarios.model.js'
import Product from '../productos/productos.model.js'

export const newBuy = async (req, res) => {
    try {
        let { id } = req.params;
        let userC = await User.findById(id);
        if (!userC) return res.status(404).send({ message: 'User not found' });

        let cart = await Cart.findOne({ user: id });
        if (!cart) return res.status(404).send({ message: 'You do not have products in the shopping cart' })

        let products = await Product.find({ _id: { $in: cart.products } })
        let outOfStockProducts = []

        products.forEach(product => {
            if (product.stock <= 0) {
                outOfStockProducts.push(product.name)
            } else {
                // Esto actualiza el stock del producto
                let cantidad = cart.products.filter(productId => productId.toString() === product._id.toString()).length;

                product.stock = product.stock - cantidad
                product.ventas = product.ventas + cantidad
                product.save()
            }
        });

        if (outOfStockProducts.length > 0) {
            console.log('Algunos productos ya no están disponibles en stock.');
            return res.status(400).send({ message: 'Los siguientes productos no están disponibles en stock:', outOfStockProducts })
        } else {
            let buy = {
                user: id,
                cart: cart._id,
                pagoTotal: cart.total
            };
            let newBuy = new Buy(buy)
            await newBuy.save()
            return res.send({ message: 'Successful purchase' })
        }

    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error adding buy' })
    }
}

