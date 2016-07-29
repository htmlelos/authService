let mongoose = require('mongoose')
let Schema = mongoose.Schema

// Establece las promesas de mongoose a las promesas nativas de javascript
mongoose.Promise = global.Promise;

let match = [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'El username debe se un correo electronico por ejemplo "username@servidor.com"']

// Definicion del usuario
let UserSchema = new Schema({
  username: {
    type: String,
    required: 'El nombre de usuario no ha sido definido y es un campo obligatorio',
    match: match
  },
  password: {
    type: String,
    required: 'La contraseña no ha sido definida y es un campo obligatorio'
  },
  status: {
    type: String,
    enum: {values: ['ACTIVO', 'INACTIVO'], message: 'el estado solo puede ser ACTIVO o INACTIVO'},
    required: 'El estado del usuario no ha sido definido y es un campo obligatorio'
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


/*UserSchema.statics.authenticate = function (email, password, callback()) {
  this
    .findOne({username: username})
    .select('password salt')
    .exec((error, user) => {
    if (error) {
      return callback(error, null)
    }
    // Si no se encontro usuario solo devolver el usuario vacio
    if (!user) {
      return callback(error, user)
    }
  })
}*/

// Validacion especifica de un campo
/*UserSchema.path('username').validate(function (username) {
   var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
   return emailRegex.test(username); // Assuming email has a text attribute
}, 'The e-mail field cannot be empty.')*/

// Establece el valor de createdAt con el momento actual
UserSchema.pre('save', next => {
  now = new Date()
  // Se asigna la fecha actual al
  if (!this.createdAt) {
    this.createdAt = now
  }
  // Se asina el usuario por omisión
  if (!this.createdBy) {
    this.createdBy = 'anonimo'
  }
  next()
})

// Exporta el Usuario para que pueda ser utilizado por el servicio
module.exports = mongoose.model('user', UserSchema)
