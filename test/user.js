// Establecemos la variable de ambiente NODE_ENV a test
process.env.NODE_ENV = 'test'

let mongoose = require('mongoose')
let User = require('../models/user')
let Role = require('../models/role')
  // Dependencias de desarrollo
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should()

chai.use(chaiHttp)
  // Bloque principal
describe('Pruebas de Usuarios', () => {
  beforeEach(done => {
    User.remove({}, err => {
      done()
    })
  })

  // GET /users - obtener todos los usuarios
  describe('GET /users', () => {
    it('deberia obtener todos los usuarios', done => {
      chai.request(server)
        .get('/users')
        .end((error, response) => {
          response.should.have.status(200)
          response.body.should.be.a('array')
          response.body.length.should.be.eql(0)
          done()
        })
    })
  })

  // POST /user - crear un nuevo usuario
  describe('POST /user', () => {
    it('no deberia crear un usuario sin nombre de usuario', done => {
      let user = {
        password: 'admin',
        status: 'ACTIVO'
      }

      chai.request(server)
        .post('/user')
        .send(user)
        .end((error, response) => {
          response.should.have.status(200)
          response.body.should.be.a('object')
          response.body.should.have.property('errors')
          response.body.errors.should.have.property('username')
          response.body.errors.username.should.have.property('kind').eql('required')
          done()
        })
    })
    it('no deberia crear un usuario sin password', done => {
      let user = {
        username: 'admin@mail.com',
        status: 'ACTIVO'
      }

      chai.request(server)
        .post('/user')
        .send(user)
        .end((error, response) => {
          response.should.have.status(200)
          response.body.should.be.a('object')
          response.body.should.have.property('errors')
          response.body.errors.should.have.property('password')
          response.body.errors.password.should.have.property('kind').eql('required')
          done()
        })
    })
    it('no crear postear un usuario sin estado', done => {
      let user = {
        username: 'admin@mail.com',
        password: 'admin'
      }

      chai.request(server)
        .post('/user')
        .send(user)
        .end((error, response) => {
          response.should.have.status(200)
          response.body.should.be.a('object')
          response.body.should.have.property('errors')
          response.body.errors.should.have.property('status')
          response.body.errors.status.should.have.property('kind').eql('required')
          done()
        })
    })
    it('deberia crear un usuario', done => {
      let user = {
        username: 'admin@mail.com',
        password: 'admin',
        status: 'ACTIVO'
      }

      chai.request(server)
        .post('/user')
        .send(user)
        .end((error, response) => {
          response.should.have.status(200)
          response.body.should.be.a('object')
          response.body.should.have.property('message').eql('Usuario creado con exito')
          response.body.user.should.have.property('_id')
          response.body.user.should.have.property('username')
          response.body.user.should.have.property('password')
          response.body.user.should.have.property('status')
          response.body.user.should.have.property('createdAt')
          response.body.user.should.have.property('createdBy')
          response.body.user.should.have.property('roles')
          response.body.user.should.have.property('profiles')
          done()
        })
    })
  })

  describe('POST /user/:userId/role', () => {
    it('deberia asignar un rol a un usuario', done => {
      let user = new User({
        username: 'admin@mail.com',
        password: 'admin',
        status: 'ACTIVO'
      })

      let role = new Role({
        name: 'admin_role',
        description: 'El usuario tiene permisos de administrador',
        status: 'ACTIVO'
      })

      role.save((error, role) => {
        // console.log('ROLE: ', role)

        user.save((error, user) => {
          // console.log('USER: ', user)
          chai.request(server)
            .post('/user/' + user._id + '/role')
            .send(role._id)
            .end((error, response) => {
              console.log('response: ', response);
              response.should.have.status(200)
              response.body.should.be.a('object')
              response.body.should.have.property('errors')
              response.body.errors.should.have.property('role')
              done()
            })
        })
      })
    })
  })

  // GET /user/:userId - Obtener un usuario dado su id
  describe('GET /user/:userId', () => {
      it('deberia obtener un usuario por su userId', done => {
        let user = new User({
          username: 'guest@mail.com',
          password: 'guest',
          status: 'ACTIVO'
        })

        user.save((error, user) => {
          chai.request(server)
            .get('/user/' + user._id)
            .send(user)
            .end((error, response) => {
              response.should.have.status(200)
              response.body.should.be.a('object')
              response.body.should.have.property('username')
              response.body.should.have.property('password')
              response.body.should.have.property('status')
              response.body.should.have.property('createdAt')
              response.body.should.have.property('createdBy')
              response.body.should.have.property('roles')
              response.body.should.have.property('profiles')
              response.body.should.have.property('_id').eql(user.id)
              done()
            })
        })
      })
    })
    // PUT /user/:userId - Actualizar un usuario por su id
  describe('PUT /user/:userId', () => {
    it('deberia actualizar un usuario por su userId', done => {
      let user = new User({
        username: 'guest@mail.com',
        password: 'guest',
        status: 'INACTIVO'
      })

      user.save((error, user) => {
        chai.request(server)
          .put('/user/' + user._id)
          .send({
            username: 'operator@mail.com',
            password: 'operator',
            status: 'ACTIVO'
          })
          .end((error, response) => {
            response.should.have.status(200)
            response.body.should.be.a('object')
            response.body.should.have.property('message').eql('Usuario actualizado con exito')
            response.body.user.should.have.property('username').eql('operator@mail.com')
              // La contraseña generada es igual a la contraseña almacenada
            User.comparePasswordAndHash('operator', user.password, function(error, areEqual) {
              // Comprobar que no existe un error
              should.not.exist(error)
                // Comprobar si son iguales
              areEqual.should.equal(true)
            })
            response.body.user.should.have.property('status').eql('ACTIVO')
              //response.body.user.should.have.property('_id').eql(user._id)
            done()
          })
      })
    })
  })

  // DELETE /user/:userId - Eliminar un usuario por su id
  describe('DELETE /user/:userId', () => {
      it('deberia eliminar un usuario por su id', done => {
        let user = new User({
          username: 'operator@mail.com',
          password: 'operator',
          status: 'ACTIVO'
        })

        user.save((error, user) => {
          chai.request(server)
            .delete('/user/' + user._id)
            .send(user)
            .end((error, response) => {
              response.should.have.status(200)
              response.body.should.be.a('object')
              response.body.should.have.property('message').eql('Usuario eliminado con exito')
              response.body.should.have.property('user')
              response.body.user.should.have.property('ok').eql(1)
              response.body.user.should.have.property('n').eql(1)
              done()
            })
        })
      })
    })
    // POST /login - Autenticar usuario
  describe('Autenticar usuario', () => {
    beforeEach(done => {
      User.remove({}, err => {
        done()
      })
    })

    it('deberia Autenticar si la contraseña es valida ', done => {
      let user = new User({
        username: 'operator@mail.com',
        password: 'operator',
        status: 'ACTIVO'
      })

      let credentials = {
        username: 'operator@mail.com',
        password: 'operator'
      }

      user.save((error, user) => {
        chai.request(server)
          .post('/user')
          .send(user)
          .end((error, response) => {
            response.should.have.status(200)
            response.body.should.be.a('object')
            response.body.should.have.property('message').eql('Usuario creado con exito')
          })
      })

      chai.request(server)
        .post('/login')
        .send(credentials)
        .end((error, response) => {
          response.should.have.status(200)
          response.body.should.be.a('object')
          response.body.should.have.property('message').eql('Usuario autenticado con exito')
          response.body.should.have.property('isAuthenticated').eql(true)
          done()
        })
    })

    it('no deberia Autenticar usuario si la conseña es invalida', done => {
      let user = new User({
        username: 'operator@mail.com',
        password: 'operator',
        status: 'ACTIVO'
      })

      let credentials = {
        username: 'operator@mail.com',
        password: 'admin'
      }

      user.save((error, user) => {
        chai.request(server)
          .post('/user')
          .send(user)
          .end((error, response) => {
            // console.log('RESPONSE: ', response);
            response.should.have.status(200)
            response.body.should.be.a('object')
            response.body.should.have.property('message').eql('Usuario creado con exito')
          })
      })

      chai.request(server)
        .post('/login')
        .send(credentials)
        .end((error, response) => {
          response.should.have.status(401)
          response.body.should.be.a('object')
          response.body.should.have.property('message').eql('Usuario invalido o contraseña incorrecta')
          response.body.should.have.property('isAuthenticated').eql(false)
          done()
        })
    })

    it('no deberia Autenticar si el estado del usuario esta INACTIVO', done => {
      let user = new User({
        username: 'manager@mail.com',
        password: 'manager',
        status: 'INACTIVO'
      })

      let credentials = {
        username: 'manager@mail.com',
        password: 'manager'
      }

      user.save((error, user) => {
        chai.request(server)
          .post('/user')
          .send(user)
          .end((error, response) => {
            response.should.have.status(200)
            response.body.should.be.a('object')
            response.body.should.have.property('message').eql('Usuario creado con exito')
          })
      })

      chai.request(server)
        .post('/login')
        .send(credentials)
        .end((error, response) => {
          // console.log('RESPONSE: ', response)
          response.should.have.status(401)
          response.body.should.be.a('object')
          response.body.should.have.property('message').eql('Usuario invalido o contraseña incorrecta')
          response.body.should.have.property('isAuthenticated').eql(false)
          done()
        })
    })
  })
})

describe('Encriptar contraseñas ', () => {
  it('deberia retornar una contraseña encriptada asincronicamente', done => {
    let password = 'secret'

    User.hashPassword(password, function(error, passwordHash) {
      // Confirmar que no existe el error
      should.not.exist(error);
      // Confirmar que la contraseña no es nula
      should.exist(passwordHash)
      done()
    })
  })

  it('deberia devolver verdadero si la contraseña es valida', done => {
    var password = 'secret'

    // Necesitamos encriptar la contraseña
    User.hashPassword(password, function(error, passwordHash) {
      User.comparePasswordAndHash(password, passwordHash, function(error, areEqual) {
        // Comprobar que no existe el error
        should.not.exist(error)
          // Comprobar que areEqual is true
        areEqual.should.equal(true)
        done()
      })
    })
  })

  it('deberia devolver falso si la contraseña es invalida', done => {
    let password = 'secret'

    User.hashPassword(password, function(error, passwordHash) {

      var invalidPassword = 'imahacker'

      // Necesitamos crear una encriptacion de la contraseña
      User.comparePasswordAndHash(invalidPassword, passwordHash, function(error, areEqual) {
        // Comprobar que error no existe
        should.not.exist(error)
          // Confirmar que areEqual es false
        areEqual.should.equal(false)
        done()
      })
    })
  })
})
