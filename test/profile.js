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
        // GET /role/:profileId - Obtener un nuevo perfil por su id
    describe('GET /role/:profileId', () => {
            it('deberia obtener un perfil por su profileId', done => {
                let profile = new Profile({
                    name: 'account_manager',
                    description: 'El perfil de este usuario es administrador de cuentas',
                    status: 'ACTIVO'
                })

                profile.save((error, role) => {
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
        // PUT /role/:roleId - Actualizar un rol por su id
        // DELETE /role/:roleId - Eliminar un
})
