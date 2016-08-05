let mongoose = require('mongoose')
let Role = require('../models/role')

// GET /roles - obtener todos los roles
function getRoles(request, response) {
  // Consulta la base de datos, si no hay errores los devuelve los roles al cliente
  let query = Role.find({})

  query.exec((error, roles) => {
    if (error) response.send(error)
      // Si no hay errores devolver los roles al cliente
    response.json(roles)
  })
}

// POST /role - crear un nuevo rol
function postRole(request, response) {
  // Crea un nuevo Rol
  let newRole = new Role(request.body)
    // Lo guarda en la base de datos
  newRole.save((error, role) => {
    if (error) {
      response.send(error)
    } else {
      response.json({
        message: 'Rol creado con exito',
        role
      })
    }
  })
}

// GET /role/:roleId - recupera un rol dado su roleId

module.exports = {
  getRoles, postRole
}
