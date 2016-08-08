// Establecemos la variable de ambiente NODE_ENV a test
process.env.NODE_ENV = 'test'

let mongoose = require('mongoose')
let Profile = require('../models/profile')

// Dependencias de desarrollo
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
let should = chai.should()

chai.use(chaiHttp)
  // Bloque principal
describe('Pruebas de Perfiles', () => {
  beforeEach(done => {
    Profile.remove({}, error => {
      done()
    })
  })

  // GET /profiles - obtener todos los Perfiles
  describe('GET /profiles', () => {
    it('deberia obtener todos los perfiles', done => {
      chai.request(server)
        .get('/profiles')
        .end((error, response) => {
          // console.log('response: ', response);
          response.should.have.status(200)
          response.body.should.be.a('array')
          response.body.length.should.be.eql(0)
          done()
        })
    })
  })

  // POST /role - crear un nuevo perfil
  describe('POST /role', () => {
      it('no deberia crear un perfil sin nombre de perfil', done => {
        let profile = {
          description: 'El perfil de este usuario es administrador de cuentas',
          status: 'ACTIVO'
        }

        chai.request(server)
          .post('/profile')
          .send(profile)
          .end((error, response) => {
            // console.log('response: ', response);
            response.should.have.status(200)
            response.body.should.be.a('object')
            response.body.should.have.property('errors')
            response.body.errors.should.have.property('name')
            response.body.errors.name.should.have.property('kind').eql('required')
            done()
          })
      })

      it('no deberia crear un perfil sin descripcion del perfile', done => {
        let profile = {
          name: 'account_manager',
          status: 'ACTIVO'
        }

        chai.request(server)
          .post('/profile')
          .send(profile)
          .end((error, response) => {
            response.should.have.status(200)
            response.body.should.be.a('object')
            response.body.should.have.property('errors')
            response.body.errors.should.have.property('description')
            response.body.errors.description.should.have.property('kind').eql('required')
            done()
          })
      })

      it('no deberia crear un perfil sin estado', done => {
        let profile = {
          name: 'account_manager',
          description: 'El perfil de este usuario es administrador de cuentas'
        }

        chai.request(server)
          .post('/profile')
          .send(profile)
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
    // GET /profile/:profileId - Obtener un nuevo perfil por su id
  describe('GET /profile/:profileId', () => {
      it('deberia obtener un perfil por su profileId', done => {
        let profile = new Profile({
          name: 'account_manager',
          description: 'El perfil de este usuario es administrador de cuentas',
          status: 'ACTIVO'
        })

        profile.save((error, profile) => {
          chai.request(server)
            .get('/profile/' + profile._id)
            .send(profile)
            .end((error, response) => {
              response.should.have.status(200)
              response.body.should.be.a('object')
              response.body.should.have.property('name')
              response.body.should.have.property('description')
              response.body.should.have.property('status')
              response.body.should.have.property('createdAt')
              response.body.should.have.property('createdBy')
              response.body.should.have.property('_id').eql(profile.id)
              done()
            })
        })
      })
    })
    // PUT /profile/:profileId - Actualizar un perfil por su profileId
  describe('PUT /profile/:profileId', () => {
      it('deberia actualizar un perfil por su profileId', done => {
        let profile = new Profile({
          name: 'assistant',
          description: 'El perfil del asistente solo permite visualizar usuarios',
          status: 'INACTIVO'
        })

        profile.save((error, profile) => {
          // console.log('PROFILE: ', profile)
          // console.log('ERROR: ', error)
          chai.request(server)
            .put('/profile/' + profile._id)
            .send({
              name: 'assistant_profile',
              description: 'El perfil del asistente solo permite visualizar usuarios',
              status: 'ACTIVO'
            })
            .end((error, response) => {
              response.should.have.status(200)
              response.body.should.be.a('object')
              response.body.should.have.property('message').eql('Perfil actualizado con exito')
              response.body.profile.should.have.property('name').eql('assistant_profile')
              response.body.profile.should.have.property('status').eql('ACTIVO')
              done()
            })
        })
      })
    })
    // DELETE /profile/:profileId - Eliminar un perfil por su profileId
})
