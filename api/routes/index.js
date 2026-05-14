const router = require('express').Router()

router.use('/media', require('./media.routes'))
router.use('/bluetooth', require('./bluetooth.routes'))
router.use('/system', require('./system.routes'))

module.exports = router