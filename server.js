let express = require('express')
let app = express()
let mongoose = require('mongoose')
let morgan = require('morgan')
let bodyParser = require('body-parser')
let port = "3000"
  /*let user = require('./controllers/user')*/
let user = require('./routes/user')
let role = require('./routes/role')
let config = require('config')
  /*let expressValidator = require('express-validator')*/
let path = require('path')
  // Configuracion de la base de datos
let options = {
    server: {
      socketOptions: {
        keepAlive: 1,
        connectTimeOutMS: 30000
      }
    },
    replset: {
      socketOptions: {
        keepAlive: 1,
        connectTimeOutMS: 30000
      }
    }
  }
// Default type promises
mongoose.Promise = global.Promise
  // Coneccion a la base de datos
mongoose.connect(config.dbhost.url + ':' + config.dbhost.port + '/' + config.dbhost.db, options)

let db = mongoose.connection

db.on('connect', console.log.bind(console, 'El servicio se conecto a: ' + config.dbhost.url + ':' + config.dbhost.port + '/' + config.dbhost.db))

db.on('error', console.error.bind(console, 'Error de conexion No se pudo conextar a: ' + config.dbhost.url + ':' + config.dbhost.port + '/' + config.dbhost.db))

// No mostrar el log cuando se esta en test
if (config.util.getEnv('NODE_ENV') !== 'test') {
  // Utiiliza morgan para la bitacora en la linea de comandos
  app.use(morgan('combined')) // Los al estilo de Apache
}

// Analizar el applicacion/json y busca por texto crudo.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.text())
app.use(bodyParser.json({
    type: 'applicacion/json'
  }))

app.get('/', (req, res) => res.json({
  message: 'API online...'
}))
// Rutas de usuarios
app.use('/', user)
app.use('/', role)

app.listen(port, function () {
  console.log('Servicio ejecutandose en el puerto: ' + port);
})

// Para el testing
module.exports = app
