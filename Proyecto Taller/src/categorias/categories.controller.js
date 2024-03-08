'use strict'

import Category from './categories.model.js'

export const save = async(req, res)=>{
    try {
        let data = req.body
        let category = new Category(data)
        await category.save()
        return res.send({message: 'Category saving successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error saving category'})
    }
}

export const updateC = async(req, res)=>{
    try {
        let { id } = req.params
        let data = req.body
        let updateCategory = await Category.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updateCategory) return res.status(400).send({message: 'Category not found and not update'})
        return res.send({message: 'Update category',updateCategory})
    } catch (error) {
        console.error(error)
        if(error.keyValue.name) return res.status(400).send({message: `Category ${error.keyValue.name} already exists`})
        return res.status(500).send({message: 'Error updating acount'})
    }
}

export const deleteC = async(req, res) =>{
    try {
        let { id } = req.params
        let category = await Category.findOne({_id: id})
        if(!category) return res.status(404).send({message: 'Category not found'})
        let defaultCategory = await Category.findOne({ name: 'Default' })
        if (!defaultCategory) {
            defaultCategory = await Category.create({ name: 'Default', description: 'Categoría por defecto' })
        }
        await Product.updateMany({ category: id }, { $set: { category: defaultCategory._id } })

        let deletedCategory = await Category.findOneAndDelete({_id: id})
        return res.send({message: `Category with username ${deletedCategory.name} deleted successfully`})   
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error deleting category'})
    }
}

export const getC = async(req, res) =>{
    try {
        let categories = await Category.find()
        if(!categories.length === 0) return res.status(404).send({message: 'Not found'})
        return res.send({ categories })
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error getting categories'})
    }
}