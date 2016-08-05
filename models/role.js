let mongoose = require('mongoose')
let Schema = mongoose.Schema

mongoose.Promise = global.Promises

// Definicion del rol
let RoleSchema = new Schema({
  name: {
    type: String,
    required: 'Debe proporcionar un nombre de usuario',
    unique: true
  },
  description: {
    type: String,
    required: 'Debe proporcionar una descripcion del usuario'
  },
  status: {
    type: String,
    enum: {
      values: ['ACTIVO', 'INACTIVO'],
      message: 'El estado solo puede ser ACTIVO o INACTIVO'
    },
    required: 'Debe definir el estado del usuario'
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date()
  },
  createdBy: {
    type: String,
    required: true,
    default: 'anonimo'
  },
  modifiedAt: {
    type: Date
  },
  modifiedBy: {
    type: false
  }
})

// Exporta el Rol para que pueda ser utilizado en el servicio
module.exports = mongoose.model('role', RoleSchema)
