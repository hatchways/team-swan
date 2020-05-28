// A router that handles all gmail auth routes
const router = require('express').Router()
const Gmail = require('../controllers/gmail')

router.get('/gmail/authurl', Gmail.getAuthURL)
router.post('/gmail/token', Gmail.generateToken)
router.get('/gmail/authenticated', Gmail.isSignedIn)

module.exports = router