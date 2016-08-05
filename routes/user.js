let express = require('express')
let router = express.Router()
let user = require('../controllers/user')

router.route('/users')
  .get(user.getUsers)

router.route('/user')
  .post(user.postUser)

router.route('/user/:userId')
  .get(user.getUser)
  .delete(user.deleteUser)
  .put(user.updateUser)

/*router.route('/user/:userId/role')
  .post(user.addRole)*/

router.route('/login')
  .post(user.login)


module.exports = router
