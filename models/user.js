let mongoose = require('mongoose')
let bcrypt = require('bcrypt-node')
let Schema = mongoose.Schema

let SALT_WORK_FACTOR = 9;

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

UserSchema.statics.hashPassword = function (password, next) {
  // Para acelerar los test, verificamos NODE_ENV
  // Si estamos realizando test, establecemos el costo SALT_WORK_FACTOR = 1
  if (process.env.NODE_ENV === 'test') {
    SALT_WORK_FACTOR = 1
  }
  bcrypt.genSalt(SALT_WORK_FACTOR, function(error, salt) {
    // Encriptar la contraseña utilizando bcrypt; pasa la funcion
    // callback `next`a bcrypt.hash()
/*    console.log('SALT', salt)*/
    bcrypt.hash(password, salt, function() {},next)
  });
/*  console.log('TEST HASH', SALT_WORK_FACTOR);  */
}

UserSchema.statics.comparePasswordAndHash = function (password, passwordHash, next) {
  // compara las contraseñas proporcionadas
  bcrypt.compare(password, passwordHash, next)
}

UserSchema.pre('save', function(next) {
  let user = this

  now = new Date()
  // Se asigna la fecha actual al
  if (!this.createdAt) {
    this.createdAt = now
  }
  // Se asina el usuario por omisión
  if (!this.createdBy) {
    this.createdBy = 'anonimo'
  }
  // Solo encriptar el password si se ha modificado la contraseña o es un nuevo usuario

  if (!user.isModified()) return next();
  // Generar una nueva salt

  bcrypt.genSalt(SALT_WORK_FACTOR, function(error, salt) {
    if (error) return next(error);

    // Encriptar el usuario junto a la nueva salt

    bcrypt.hash(user.password, salt, function() {
    },function(err, hash) {
      if (err) return next(err);

      // sobreescribe la contraseña en texto plano con la contraseña encriptada
      user.password = hash;
      next();
    })
  })
})

// Exporta el Usuario para que pueda ser utilizado por el servicio
module.exports = mongoose.model('user', UserSchema)
