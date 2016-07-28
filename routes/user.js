let mongoose = require('mongoose')
let User = require('../models/user')

// GET /users - obtener todos los usuarios
function getUsers(request, response) {
  // Consulta la base de datos, si no hay errores los devuelve los usuarios al cliente
  let query = User.find({})

  query.exec((error, users) => {
    if (error) response.send(error)
      // Si no hay errores devolver los usuarios al cliente
    response.json(users)
  })
}

// POST /user - crear un nuevo usuario
function postUser(request, response) {
  // Crea un nuevo usuario
  var newUser = new User(request.body)
    // Lo guarda en la base de datos
  newUser.save((error, user) => {
    if (error) {
      response.send(error)
    } else {
      response.json({
        message: 'Usuario creado con exito',
        user
      })
    }
  })
}

// GET /user/:userId - recupera un usuario dado su id
function getUser(request, response) {
  User.findById(request.params.userId, (error, user) => {
    if (error) response.send(error)

    // Si no hay errores, devuelve el usuario al cliente
    response.json(user)
  })
}

// PUT /user/:userId - actualiza un usuario dado su id
function updateUser(request, response) {
  User.findById({
    _id: request.params.id
  }, (error, user) => {
    if (error) response.send(error)

    Object.assign(user, request.body).save((error, user) => {
      if (error) response.send(error)

      response.json({
        message: 'Usuario actualizado con exito',
        user
      })
    })
  })
}

// DELETE /user/:userId - elimina un usuario dado su id
function deleteUser(request, response) {
  User.remove({
    _id: request.params.id
  }, (error, user) => {
    response.json({
      message: 'Usuario eliminado con exito',
      user
    })
  })
}

// Exporta todas las funciones
module.exports = {
  getUsers, postUser, getUser, updateUser, deleteUser
}