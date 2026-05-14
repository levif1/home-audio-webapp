const WebSocket = require('ws')

module.exports = (server) => {

    const wss = new WebSocket.Server({
        server
    })

    wss.on('connection', (ws) => {

        console.log('Client connected')

        ws.send(JSON.stringify({
            type: 'connected',
            message: 'socket ready'
        }))

        ws.on('close', () => {
            console.log('Client disconnected')
        })
    })
}