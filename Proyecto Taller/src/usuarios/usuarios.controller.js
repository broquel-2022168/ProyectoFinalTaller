'use strict'

import { generateJwt } from '../utils/jwt.js'
import { checPassword, checkUpdate, encrypt } from '../utils/validator.js'
import User from './usuarios.model.js'
import Buy from '../compras/compras.model.js'

export const usuarioPorDefecto =async()=>{
    try {
        let user={
            name: 'Juan',
            surname: 'Roquel',
            email: 'Juanroquel@gmail.com',
            username: 'juan7474',
            password: '12345678',
            role: 'ADMIN'
        }
        user.password = await encrypt(user.password)
        let userDefect = new User(user)
        await userDefect.save()
        return console.log("Guardado exitosamente")
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'No se pudo asignar un usuario por defecto'})
    }
}
export const register = async(req, res)=>{
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        data.role= 'CLIENT'
        let user = new User(data)
        await user.save()
        return res.send({message: 'Registered Succesfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message:'Error saving user',error})
    }
}

export const login = async(req, res)=>{
    try {
        let {username, password} = req.body
        let user = await User.findOne({username})
        if(user && await checPassword(password, user.password)){
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            return res.send({message: `Welcome ${user.name}`,
            loggedUser,
            token
            })
        }
        return res.status(404).send({message: 'Invalid credentials'})        
    } catch (error) {
        console.error(error)
        res.status(500).send({message: 'Failed to login'})
    }
}

export const updateUser = async(req, res)=>{
    try {
        let { id } = req.params
        let data = req. body
        let update = checkUpdate(data, id)
        if(!update)return res.status(404).send({message: 'Have submited some data that cannot be update or missing'})
        let updateUser = await User.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updateUser) return res.status(400).send({message: `User not found and not update`})
        return res.send({message:'update user',updateUser})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error updating acount'})
    }
}

export const deleteU = async(req, res) =>{
    try {
        let {id} = req.params
        let deletedUser = await User.findOneAndDelete({_id: id})
        if(!deletedUser) return res.status(404).send({message: 'Account not found and not deleted'})
        return res.send({message: `Account with username ${deletedUser.username} deleted successfully`})
    } catch (error) {
        return res.status(500).send({message: 'Error deleting acount'})
    }
}

export const historial = async(req, res)=>{
    try {
        let { idU } = req.params
        let compras = await Buy.find({user: idU}) 
        if(!compras) return res.status(404).send({message: 'No haz realizado ninguna compra'})
        return res.send({compras})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error not'})
    }
}

export const serAdmin = async(req, res)=>{
    try {
        let { id } = req.params
        let user = await User.findOne({_id: id})
        if(!user) return res.status(404).send({message: 'User not found'})
        user.role = 'ADMIN'
        await user.save()
        return res.send({message: 'Ahora eres admin :)'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Tu no puedes ser admin'})
    }
}