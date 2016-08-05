let mongoose = require('mongoose')
let Schema = mongoose.Schema

mongoose.Promise = global.Promises

// Definicion del rol
let RoleSchema = new Schema({
  name: {
    type: String,
    required: 'El nombre de rol no ha sido definido y es un dato obligatorio',
    unique: true
  },
  description: {
    type: String,
    required: 'La descripcion del rol no se ha definido y es un dato obligatorio'
  },
  status: {
    type: String,
    enum: {
      values: ['ACTIVO', 'INACTIVO'],
      message: 'El estado solo puede ser ACTIVO o INACTIVO'
    },
    required: 'El estado del rol no ha sido definido y es un dato obligatorio'
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
