'use strict'

import Buy from '../compras/compras.model.js'
import User from '../usuarios/usuarios.model.js'
import Producto from '../productos/productos.model.js'
import Cart from '../cart/cart.model.js'
import Factura from '../factura/factura.model.js'
import PDFDocument from 'pdfkit';
import fs from 'fs';



export const newFact = async (req, res) => {
    try {
        let { idB } = req.params
        let buy = await Buy.findById(idB)
        if (!buy) return res.status(404).send({ message: 'No se puede generar una factura de una compra inexistente' })

        let user = await User.findOne({ _id: buy.user })
        if (!user) return res.status(404).send({ message: 'User not found' })

        let cart = await Cart.findOne({ user: user })
        if (!cart) return res.status(404).send({ message: 'Cart not found' })

        let products = await Producto.find({ _id: { $in: cart.products } })
        if (!products || products.length === 0) return res.status(404).send({ message: 'No products found for the cart' })

        let productNames = products.map(product => ({ name: product.name, price: product.price, description: product.description }))


        let factura = {
            user: buy.user,
            buy: buy,
            products: productNames,
            totalP: buy.pagoTotal
        }

        let facture = new Factura(factura)
        await facture.save()
        return res.send({ message: 'La Factura se guardo' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error saving factura' })
    }
}


export const generatePDFInvoice = async (req, res) => {
    try {
        const { idF } = req.params;

        // Obtener la factura de la base de datos
        const factura = await Factura.findById(idF).populate('user').populate('products');

        // Crear un nuevo documento PDF
        const doc = new PDFDocument();

        // Establecer el nombre del archivo PDF
        const fileName = `factura_${factura.user.name}.pdf`;

        // Pipe the PDF into a writeable stream
        const writeStream = fs.createWriteStream(fileName);
        doc.pipe(writeStream);

        // Agregar contenido al PDF
        doc.fontSize(20).text('Factura', { align: 'center' }).moveDown(1);
        doc.fontSize(12).text(`Fecha: ${factura.date.toLocaleString()}`, { align: 'right' }).moveDown(1);
        doc.fontSize(12).text(`Usuario: ${factura.user.name}`, { align: 'left' }).moveDown(1);

        // Mostrar los productos
        factura.products.forEach((product, index) => {
            doc.fontSize(14).text(`${index + 1}. Producto: ${product.name}`, { continued: true }).text(` - Descripción: ${product.description}`);
            doc.fontSize(12).text(`   Precio: $${product.price.toFixed(2)}`).moveDown(0.5);
        });

        // Mostrar el total al final del PDF
        doc.fontSize(16).text(`Total: $${factura.totalP.toFixed(2)}`, { align: 'right' }).moveDown(1);

        // Finalizar el documento PDF
        doc.end();

        // Enviar el archivo PDF como respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        // Pipe the PDF into the response stream
        doc.pipe(res);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error generating PDF invoice' });
    }
};






/*export const pdfInvoice = async (invoice) => {
    try {
        const { date, total, nit, shopping, _id } = invoice

        const formatDate = date.toLocaleString('en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        })

        let shoppingData = await Shopping.findOne({ _id: shopping })
        let userData = await User.findOne({ _id: shoppingData.user })

        const doc = new PDFDocument()

        doc.fontSize(20).font('Helvetica-Bold').text('Invoice', { align: 'center' }).moveDown(1)
        doc.fontSize(12).font('Helvetica-Bold').text('ID: ', { continued: true }).font('Helvetica').text(_id).moveDown(0.5)
        doc.fontSize(12).font('Helvetica-Bold').text('Date: ', { continued: true }).font('Helvetica').text(formatDate).moveDown(0.5)
        doc.fontSize(12).font('Helvetica-Bold').text('NIT: ', { continued: true }).font('Helvetica').text(nit).moveDown(0.5)

        const table = {
            headers: ['Product', 'Quantity', 'Price', 'Subtotal'],
            rows: []
        }

        for (const item of shoppingData.products) {
            let product = await Product.findOne({ _id: item.product })
            const subTotal = (item.quantity * product.price).toFixed(2)
            table.rows.push([product.name, item.quantity, $${product.price.toFixed(2)}, $${subTotal}])
        }

        doc.table(table, {
            prepareHeader: () => doc.font('Helvetica-Bold').fontSize(14),
            prepareRow: () => doc.font('Helvetica').fontSize(12)
        })

        doc.fontSize(13).font('Helvetica-Bold').text('Subtotal: ', { continued: true }).font('Helvetica').text($${shoppingData.subTotal.toFixed(2)}).moveDown(0.5)
        doc.fontSize(13).font('Helvetica-Bold').text('Total: ', { continued: true }).font('Helvetica').text($${total.toFixed(2)}).moveDown(0.5)

        doc.fontSize(13).font('Helvetica-Bold').text('Name: ', { continued: true }).font('Helvetica').text(userData.name).moveDown(0.5)
        doc.fontSize(13).font('Helvetica-Bold').text('Surname: ', { continued: true }).font('Helvetica').text(userData.surname).moveDown(0.5)
        doc.fontSize(13).font('Helvetica-Bold').text('Username: ', { continued: true }).font('Helvetica').text(userData.username).moveDown(0.5)
        doc.fontSize(13).font('Helvetica-Bold').text('Email: ', { continued: true }).font('Helvetica').text(userData.email).moveDown(3)
        doc.fontSize(14).text('Thanks for your purchase')

        doc.pipe(fs.createWriteStream('invoice.pdf'))

        doc.end()
    } catch (error) {
        console.error(error)
    }
}
*/