const media = require('../services/media.service')

exports.status = async (req, res) => {

    try {

        const status = await media.getStatus()

        res.json(status)

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.toString()
        })
    }
}

exports.play = async (req, res) => {

    await media.play()

    res.json({
        success: true
    })
}

exports.pause = async (req, res) => {

    await media.pause()

    res.json({
        success: true
    })
}

exports.playPause = async (req, res) => {

    await media.playPause()

    res.json({
        success: true
    })
}

exports.next = async (req, res) => {

    await media.next()

    res.json({
        success: true
    })
}

exports.previous = async (req, res) => {

    await media.previous()

    res.json({
        success: true
    })
}

exports.volume = async (req, res) => {

    const { volume } = req.body

    await media.setVolume(volume)

    res.json({
        success: true
    })
}

exports.players = async (req, res) => {

    try {
        const players = await media.getPlayers()
        res.json(players)

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.toString()
        })
    }
}