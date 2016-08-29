let mongoose = require('mongoose')
let User = require('../models/user')
let Role = require('../models/role')

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
		if(error && error.code == 11000) {
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

	// function respondUser(response, user) {
	// 	return User.populate(roles)
	// }

	function respondOk(response, user) {
		// console.log('OK USER', user)
		response.json(user)
	}

	function respondError(response, error) {
		response.send(error)
	}
	//Busca un usuario por su userId
	User.findById(request.params.userId)
		.populate('roles')
		.execPopulate()
		.then(user => respondOk(response, user))
		// .then(user => {
		// 	console.log('USER: ', user)
		// })
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

// GET /user/:userId/roles
function getRoles(request, response) {
	function respondOk(response, user) {
		response.json({
			message: 'Roles encontrados',
			roles: user.roles
		})
	}

	function respondError(response, error) {
		response.send(error)
	}

	User.findById(request.params.userId)
		.then(user => respondOk(response, user))
		.catch(error => respondError(response, error))
}

// POST /user/:userId/role
function addRole(request, response) {

	function respondOk(response, user) {

		response.json({
			message: 'Rol asociado con exito',
			user
		})
	}

	function respondAssignRole(response, role, user) {
		if(!role) {
			let error = { errors: { message: 'El rol no es valido', user } }

			response.status(422).json(error)
		} else {
				// Verifico si el rol ya se encuentra asociado al usuario
			let includes = user.roles.map(x => x.toString()).includes(role._id.toString())
				// Asigno el nuevo rol al usuario
			if(!includes) {
				user.roles.push(role._id)
				user
					.save()
					.then(user => respondOk(response, user))
					.catch(error => respondError(response, error))
			} else {
				let error = { errors: { message: 'Rol previamente asociado', user } }
				response.status(422).json(error)
			}
		}
	}

	function respondAddRole(response, user) {
		let roleId = request.body.roleId

		// Verfico si el rol fue indicado
		if(!roleId || roleId.length === 0) {
			let error = { errors: { message: 'El rol no ha sido indicado', user } }

			response.status(422).json(error)
		} else {
			Role.findById({
					_id: roleId
				})
				.then(role => respondAssignRole(response, role, user))
				.catch(error => respondError(response, role))
		}
	}

	function respondError(response, error) {
		response.send(error)
	}

	User.findById({
			_id: request.params.userId
		})
		.then(user => respondAddRole(response, user))
		.catch(error => respondError(response, error))
}

// POST /login - autenticar un usuario
function login(request, response) {

	function authenticateUser(response, user) {
		if(user) {
			User.comparePasswordAndHash(request.body.password, user.password, (error, isAuthenticated) => {
				// Si la contraseña es correcta y el usuario es activo el usuario esta autenticado
				if(user.status === 'ACTIVO' && isAuthenticated)
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

	User.findOne({
			username: request.body.username
		})
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
	getRoles,
	addRole,
	login
}
