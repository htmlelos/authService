let express = require('express')
let router = express.Router()
let profile = require('../controllers/profile')

router.route('/profiles')
  .get(profile.getProfiles)

router.route('/profile')
  .post(profile.postProfile)

router.route('/profile/:profileId')
  .get(profile.getProfile)
  .put(profile.updateProfile)

module.exports = router
