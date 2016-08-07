let express = require('express')
let router = express.Router()
let role = require('../controllers/role')

router.route('/roles')
  .get(role.getRoles)

router.route('/role')
  .post(role.postRole)


router.route('/role/:roleId')
  .get(role.getRole)
  .put(role.updateRole)
  .delete(role.deleteRole)

module.exports = router
