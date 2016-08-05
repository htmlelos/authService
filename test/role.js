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
        description: 'Usuario administrador',
        status: 'ACTIVO'
      }

      chai.request(server)
        .post('/role')
        .send(role)
        .end((error, response) => {
          /*console.log('RESPONSE: ', response)*/
          response.should.have.status(200)
          response.body.should.be.a('object')
          response.body.should.have.property('errors')
          response.body.errors.should.have.property('name')
          response.body.errors.name.should.have.property('kind').eql('required')
          done()
      })
    })
  })

})
