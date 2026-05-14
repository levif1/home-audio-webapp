require('dotenv').config()

const express = require('express')
const cors = require('cors')
const http = require('http')

const routes = require('./routes')
const setupWebSocket = require('./websocket/socket')

const app = express()
const server = http.createServer(app)

app.use(cors())
app.use(express.json())

app.use('/api', routes)

setupWebSocket(server)

const PORT = process.env.PORT || 3000

server.listen(PORT, '0.0.0.0', () => {
    console.log(`API running on port ${PORT}`)
})