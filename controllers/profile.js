let mongoose = require('mongoose')
let Profile = require('../models/profile')

// GET /profiles - obtener todos los Perfiles
 function getProfiles(request, response) {
// Consulta la base de datos, si no hay errores los devuelve al cliente

function respondOk(response, profiles) {
  response.json(profiles)
}

function respondError(response, profiles) {
  response.send(error)
}

  Profile.find({})
    .then(profiles => respondOk(response, profiles))
    .catch(error => respondError(response, error))
}

// POST /profile - crear un nuevo perfil
function postProfile(request, response) {

  function respondCreated(response, profile) {
    response.json({
      message: 'Perfil Creado con exito'
    })
  }

  function respondError(response, error) {
    response.send(error)
  }

  // Crea un nuevo Perfil
  var newProfile = new Profile(request.body)
  // Lo persiste en la base de datos
  newProfile.save()
    .then(profile => respondCreated(response, profile))
    .catch(error => respondError(response, error))
}

// GET /profile/:profileId - recupera el perfil dado su profileId
function getProfile(request, response) {

  function respondOk(response, profile) {
    response.json(profile)
  }

  function respondError(response, error) {
    response.send(error)
  }

  Profile.findById(request.params.profileId)
    .then(profile => respondOk(response, profile))
    .catch(error => respondError(response, error))
}

// PUT /profile/:profileId - actualiza un perfil por su profileId
function updateProfile(request, response) {

function respondUpdated(response, profile) {
  response.json({
    message: 'Perfil actualizado con exito',
    profile
  })
}

function respondError(response, error) {
  response.send(error)
}

function respondOk(response, profile) {
  Object
    .assign(profile, request.body)
    .save()
    .then(profile => respondUpdated(response, profile))
    .catch(error => respondError(response, error))
}
  Profile.findById({_id: request.params.profileId})
    .then(profile => respondOk(response, profile))
    .catch(error => respondError(response, error))
}

module.exports = {
  getProfiles,
  postProfile,
  getProfile,
  updateProfile
}
