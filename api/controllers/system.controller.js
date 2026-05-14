exports.health = async (req, res) => {
    res.json({
        success: true,
        status: 'online',
        timestamp: Date.now()
    })
}