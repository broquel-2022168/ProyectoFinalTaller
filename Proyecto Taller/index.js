import { initServer } from './configs/app.js'
import { connect } from './configs/mongo.js'
import { usuarioPorDefecto } from './src/usuarios/usuarios.controller.js'

initServer()
connect()
usuarioPorDefecto()