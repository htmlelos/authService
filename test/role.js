//Establecemos la variable de ambiente NODE_ENV a test
process.env.NODE_ENV = 'test'

let mongoose = require('mongoose')
let Role = require('../models/role')
  // Dependendias de desarrollo
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should()

chai.use(chaiHttp)
  // Bloque principal
describe('Pruebas de Roles', () => {
  beforeEach(done => {
    Role.remove({}, err => {
      done()
    })
  })

  // GET /roles - obtener todos los roles
  describe('GET /roles', () => {
    it('deberia obtener todos los roles', done => {
      chai.request(server)
        .get('/roles')
        .end((error, response) => {
          response.should.have.status(200)
          response.body.should.be.a('array')
          response.body.length.should.be.eql(0)
          done()
        })
    })
  })

  // POST /role - crear un nuevo rol
  describe('POST /user', () => {
    it('no deberia crear un rol sin nombre de rol', done => {
      let role = {
        description: 'El Usuario solo tiene permisos de  administrador',
        status: 'ACTIVO'
      }

      chai.request(server)
        .post('/role')
        .send(role)
        .end((error, response) => {
          response.should.have.status(200)
          response.body.should.be.a('object')
          response.body.should.have.property('errors')
          response.body.errors.should.have.property('name')
          response.body.errors.name.should.have.property('kind').eql('required')
          done()
        })
    })

    it('no deberia crear un rol sin descripcion del rol', done => {
      let role = {
        name: 'admin_role',
        status: 'ACTIVO'
      }

      chai.request(server)
        .post('/role')
        .send(role)
        .end((error, response) => {
          response.should.have.status(200)
          response.body.should.be.a('object')
          response.body.should.have.property('errors')
          response.body.errors.should.have.property('description')
          response.body.errors.description.should.have.property('kind').eql('required')
          done()
        })
    })

    it('no deberia crear un rol sin estado', done => {
      let role = {
        name: 'admin_role',
        description: 'El usuario tiene permisos de administrador'
      }

      chai.request(server)
        .post('/role')
        .send(role)
        .end((error, response) => {
          response.should.have.status(200)
          response.body.should.be.a('object')
          response.body.should.have.property('errors')
          response.body.errors.should.have.property('status')
          response.body.errors.status.should.have.property('kind').eql('required')
          done()
        })
    })

  })

  // GET /role/:roleId - Obtener un rol por dado su id
  describe('GET /role/:roleId', () => {
    it('deberia obtener un rol por su roleId', done => {
      let role = new Role({
        name: 'view_role',
        description: 'El usuario solo tiene permisos de visualizacion',
        status: 'ACTIVO'
      })

      role.save((error, role) => {
        chai.request(server)
          .get('/role/' + role._id)
          .send(role)
          .end((error, response) => {
            response.should.have.status(200)
            response.body.should.be.a('object')
            response.body.should.have.property('name')
            response.body.should.have.property('description')
            response.body.should.have.property('status')
            response.body.should.have.property('createdAt')
            response.body.should.have.property('createdBy')
            response.body.should.have.property('_id').eql(role.id)
            done()
          })
      })
    })
  })
  // PUT /role/:roleId - Actualizar un rol por su id
  describe('PUT /user/:roleId', () => {
    it('deberia actualizar un usuario por su roleId', done => {
      let role = new Role({
        name: 'user_role',
        description: 'El usuario posee permisos restringidos',
        status: 'INACTIVO'
      })

      role.save((error, role) => {
        chai.request(server)
          .put('/role/' + role._id)
          .send({
            name: 'operator_role',
            description: 'El usuario posee permisos restringidos',
            status: 'ACTIVO'
          })
          .end((error, response) => {
            response.should.have.status(200)
            response.body.should.be.a('object')
            response.body.should.have.property('message').eql('Rol actualizado con exito')
            response.body.role.should.have.property('name').eql('operator_role')
            response.body.role.should.have.property('status').eql('ACTIVO')
            done()
          })
      })
    })
  })

  // ROLE /role/:roleId - Eliminar un usuario por su id
  describe('DELETE /role/:roleId', () => {
    it('deberia eliminar un rol por su id', done => {
      let role = new Role({
        name: 'user_role',
        description: 'El usuario posee permisos restringidos',
        status: 'INACTIVO'
      })

      role.save((error, role) => {
        chai.request(server)
          .delete('/role/' + role._id)
          .send(role)
          .end((error, response) => {
            response.should.have.status(200)
            response.body.should.be.a('object')
            response.body.should.have.property('message').eql('Rol eliminado con exito')
            response.body.should.have.property('role')
            response.body.role.should.have.property('ok').eql(1)
            response.body.role.should.have.property('n').eql(1)
            done()
          })
      })
    })
  })
})
