const router = require('express').Router()
const controller = require('../controllers/system.controller')

router.get('/health', controller.health)

module.exports = router