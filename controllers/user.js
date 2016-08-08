let mongoose = require('mongoose')
let User = require('../models/user')

// GET /users - obtener todos los usuarios
function getUsers(request, response) {

    function respondOk(response, users) {
        response.json(users)
    }

    function respondError(response, error) {
        response.send(error)
    }
    // Consulta la base de datos, si no hay errores los devuelve los usuarios al cliente
    User.find({})
        .then(users => respondOk(response, users))
        .catch(error => respondError(response, error))
}

// POST /user - crear un nuevo usuario
function postUser(request, response) {
    function respondCreated(response, user) {
        response.json({
            message: 'Usuario creado con exito',
            user
        })
    }

    function respondError(response, error) {
        // console.log('ERROR: ', error);
        if (error && error.code == 11000) {
            response.json({
                message: 'Usuario duplicado',
                error
            })
        } else {
            response.send(error)
        }
    }

    // Crea un nuevo usuario
    let newUser = new User(request.body);

    newUser.save()
        .then(user => respondCreated(response, user))
        .catch(error => respondError(response, error))
}

// GET /user/:userId - recupera un usuario dado su userId
function getUser(request, response) {

    function respondOk(response, user) {
        response.json(user)
    }

    function respondError(response, error) {
        response.send(error)
    }
    //Busca un usuario por su userId
    User.findById(request.params.userId)
        .then(user => respondOk(response, user))
        .catch(error => respondError(response, error))
}

// PUT /user/:userId - actualiza un usuario dado su userId
function updateUser(request, response) {

    function respondUpdated(response, user) {
        response.json({
            message: 'Usuario actualizado con exito',
            user
        })
    }

    function respondError(response, error) {
        response.send(error)
    }

    function respondOk(response, user) {
        Object
            .assign(user, request.body)
            .save()
            .then(user => respondUpdated(response, user))
            .catch(error => respondError(response, error))
    }

    User.findById({
            _id: request.params.userId
        })
        .then(user => respondOk(response, user))
        .catch(error => respondError(response, error))
}

// DELETE /user/:userId - elimina un usuario dado su userId
function deleteUser(request, response) {

    function responseOk(response, user) {
        response.json({
            message: 'Usuario eliminado con exito',
            user
        })
    }

    function respondError(response, error) {
        response.send(error)
    }

    User.remove({
            _id: request.params.userId
        })
        .then(user => responseOk(response, user))
        .catch(error => respondError(response, error))
}

// POST /login - autenticar un usuario
function login(request, response) {

    function authenticateUser(response, user) {
      if (user) {
        User.comparePasswordAndHash(request.body.password, user.password, (error, isAuthenticated) => {
          // Si la contraseña es correcta y el usuario es activo el usuario esta autenticado
          if (user.status === 'ACTIVO' && isAuthenticated)
            response.status(200).json({
              message: 'Usuario autenticado con exito',
              isAuthenticated: isAuthenticated
            })
          else {
            response.status(401).json({
              message: 'Usuario invalido o contraseña incorrecta',
              isAuthenticated: false
            })
          }
        })
      }
    }

    function respondError(response, error) {
      response.send(error)
    }

    User.findOne({username: request.body.username})
      .then(user => authenticateUser(response, user))
      .catch(error => respondError(response, error))
}

// Exporta todas las funciones
module.exports = {
    getUsers,
    postUser,
    getUser,
    updateUser,
    deleteUser,
    login
}
