const net = require('net')

class SnapcastService {

    constructor() {
        this.host = process.env.SNAPCAST_HOST || '127.0.0.1'
        this.port = parseInt(process.env.SNAPCAST_PORT || '1705')
        this.requestId = 1
    }

    send(method, params = {}) {

        return new Promise((resolve, reject) => {

            const socket = new net.Socket()

            const requestId = this.requestId++

            const payload = {
                id: requestId,
                jsonrpc: '2.0',
                method,
                params
            }

            let buffer = ''

            socket.setEncoding('utf8')

            socket.connect(this.port, this.host, () => {

                socket.write(
                    JSON.stringify(payload) + '\r\n'
                )
            })

            socket.on('data', (chunk) => {

                buffer += chunk

                // Snapcast responses end in newline
                const messages = buffer.split('\r\n')

                for (const message of messages) {

                    if (!message.trim()) continue

                    try {

                        const response = JSON.parse(message)

                        if (response.id !== requestId) {
                            continue
                        }

                        socket.destroy()

                        if (response.error) {
                            reject(response.error)
                            return
                        }

                        resolve(response.result)
                        return

                    } catch (err) {
                        // Wait for full packet
                    }
                }
            })

            socket.on('error', (err) => {
                reject(err)
            })

            socket.setTimeout(5000, () => {
                socket.destroy()
                reject(new Error('Snapcast timeout'))
            })
        })
    }

    async getStatus() {
        return this.send('Server.GetStatus')
    }

    async getGroups() {

        const status = await this.getStatus()

        return status.groups || []
    }

    async getClients() {

        const status = await this.getStatus()

        return status.clients || []
    }
}

module.exports = new SnapcastService()