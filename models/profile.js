let mongoose = require('mongoose')
let Schema = mongoose.Schema

mongoose.Promise = global.Promises

// Definicion de Profile
let ProfileSchema = new Schema({
    name: {
        type: String,
        required: 'Debe proporcionar un nombre al perfil',
        unique: true
    },
    description: {
        type: String,
        required: 'Debe proporcionar una descripcion del perfil'
    },
    status: {
        type: String,
        enum: {
            values: ['ACTIVO', 'INACTIVO'],
            message: 'El estado solo puede ser ACTIVO o INACTIVO'
        },
        required: 'Debe definir el estado del perfil'
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
}, {
    versionKey: false
})

// Exporta el Perfil para que pueda ser utilizado en el servicio
module.exports = mongoose.model('profile', ProfileSchema)
