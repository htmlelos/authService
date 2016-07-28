let mongoose = require('mongoose')
let Schema = mongoose.Schema

// Definicion del usuario
let UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String
  },
  roles: {
    type: Array
  },
  profiles: {
    type: Array
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
    type: String
  }
}, {
  versionKey: false
})

// Establece el valor de createdAt con el momento actual
UserSchema.pre('save', next => {
  console.log('PRESAVE');
  now = new Date()
  console.log('CREADO EN: ' + this.createdAt);
  if (!this.createdAt) {
    this.createdAt = now
  }
  console.log('CREADO POR: ' + this.createdBy);
  if (!this.createdBy) {
    this.createdBy = 'anonimo'
  }
  next()
})

// Exporta el Usuario para que pueda ser utilizado por el servicio
module.exports = mongoose.model('user', UserSchema)
