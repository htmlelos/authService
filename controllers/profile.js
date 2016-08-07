let mongoose = require('mongoose')
let Profile = require('../models/profile')

// GET /profiles - obtener todos los Perfiles
function getProfiles(request, response) {
  // Consulta la base de datos, si no hay errores los devuelve al cliente
  let query = Profile.find({})

  query.exec((error, profiles) => {
    if (error) response.send(error)

    // Si no hay errores devolver los usuarios al cliente
    response.json(profiles)
  })
}

// POST /profile - crear un nuevo perfil
function postProfile(request, response) {
  // Crea un nuevo Perfil
  var newProfile = new Profile(request.body)
  // Lo persiste en la base de datos
  newProfile.save((error, profile) => {
    if (error) {
      response.send(error)
    } else {
      response.json({
        message: 'Perfil creado con exito',
        profile
      })
    }
  })
}

// GET /role/:profileId - recupera el perfil dado su profileId
function getProfile(request, response) {
  Profile.findById(request.params.profileId, (error, profile) => {
    if (error) response.send(error)
    // Si no hay errores, devuelve el perfil al cliente
    response.json(profile)
  })
}

module.exports = {
  getProfiles, postProfile, getProfile
}
