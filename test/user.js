// Establecemos la variable de ambiente NODE_ENV a test
process.env.NODE_ENV = 'test'

let mongoose = require('mongoose')
let User = require('../models/user')
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
    });
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
          username: 'admin',
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
          username: 'admin',
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
          username: 'admin',
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
    // GET /user/:userId - Obtener un usuario dado su id
  describe('GET /user/:userId', () => {
    it('deberia obtener un usuario por su userId', done => {
      let user = new User({
        username: 'guest',
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
        username: 'guest',
        password: 'guest',
        status: 'ACTIVO'
      })

      user.save((error, user) => {
        chai.request(server)
          .put('/user/' + user._id)
          .send({username: 'operator', password: 'operator', status: 'INACTIVO'})
          .end((error, response) => {
            response.should.have.status(200)
            response.body.should.be.a('object')
            response.body.should.have.property('message').eql('Usuario actualizado con exito')
            response.body.user.should.have.property('username').eql('operator')
            response.body.user.should.have.property('password').eql('operator')
            response.body.user.should.have.property('status').eql('INACTIVO')
            //response.body.user.should.have.property('_id').eql(user._id)
            done()
        })
      })
    })
  })

  // DELETE /user/:userId - Eliminar un usuario por su id
  describe('DELETE /user/:userId', () => {
    it('deberia eliminar un usuario por su id', () => {
      let user = new User({
        username: 'operator',
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
            response.body.result.should.have.property('ok').eql(1)
            response.body.result.should.have.property('n').eql(1)
            done()
        })
      })
    })
  })
})