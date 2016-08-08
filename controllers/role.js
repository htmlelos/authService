let mongoose = require('mongoose')
let Role = require('../models/role')

// GET /roles - obtener todos los roles
function getRoles(request, response) {

    function respondOk(response, roles) {
        response.json(roles)
    }

    function respondError(response, roles) {
        response.send(error)
    }
    // Consulta la base de datos, si no hay errores los devuelve los roles al cliente
    Role.find({})
        .then(roles => respondOk(response, roles))
        .catch(error => respondError(response, error))
}

// POST /role - crear un nuevo rol
function postRole(request, response) {
    // Crea un nuevo Rol
    function respondCreated(response, role) {
        response.json({
            message: 'Role creado con exito',
            role
        })
    }

    function respondError(response, error) {
        if (error && error.code == 11000) {
            response.json({
                message: 'Rol duplicado',
                error
            })
        } else {
            response.send(error)
        }
    }

    // Crea un nuevo Rol
    let newRole = new Role(request.body)

    newRole.save()
        .then(role => respondCreated(response, role))
        .catch(error => respondError(response, error))
}

// GET /role/:roleId - recupera un rol dado su roleId
function getRole(request, response) {

    function respondOk(response, role) {
        response.json(role)
    }

    function respondError(response, error) {
        response.send(error)
    }

    Role.findById(request.params.roleId)
        .then(role => respondOk(response, role))
        .catch(error => respondError(response, error))
}

// PUT /role/:roleId - actualiza un rol dado su id
function updateRole(request, response) {

    function respondUpdated(response, role) {
        response.json({
            message: 'Rol actualizado con exito',
            role
        })
    }

    function respondError(response, error) {
        response.send(error)
    }

    function respondOk(response, role) {
        Object
            .assign(role, request.body)
            .save()
            .then(role => respondUpdated(response, role))
            .catch(error => respondError(response, error))
    }

    Role.findById({
      _id: request.params.roleId
    })
      .then(role => respondOk(response, role))
      .catch(error => respondError(response, error))
}

// DELETE /role/:roleId - elimina un rol dado su id
function deleteRole(request, response) {

    function respondOk(response, role) {
        response.json({
            message: 'Rol eliminado con exito',
            role
        })
    }

    function respondError(response, error) {
        response.send(error)
    }

    Role.remove({
            _id: request.params.roleId
        })
        .then(role => respondOk(response, role))
        .catch(error => respondError(response, error))
}

module.exports = {
    getRoles,
    postRole,
    getRole,
    updateRole,
    deleteRole
}
