const router = require('express').Router()

const controller = require('../controllers/media.controller')

router.get(
    '/status',
    controller.status
)

router.get(
    '/players',
    controller.players
)

router.post(
    '/play',
    controller.play
)

router.post(
    '/pause',
    controller.pause
)

router.post(
    '/toggle',
    controller.playPause
)

router.post(
    '/next',
    controller.next
)

router.post(
    '/previous',
    controller.previous
)

router.post(
    '/volume',
    controller.volume
)

module.exports = router