const { exec } = require('child_process')

class MediaService {
    run(command) {
        return new Promise((resolve, reject) => {
            // const activePlayer = this.getActivePlayer().then(player => {
            //     console.log("Active player:", player);
            //     if (!player) {
            //         console.log('rejecting: No active player');
            //         reject(
            //             new Error(
            //                 'No active player'
            //             )
            //         )
            //         return
            //     }
            //     const playerCommand = `playerctl -p ${player} ${command}`;
            //     console.log("Running command:", playerCommand);
            //     exec(playerCommand, (error, stdout, stderr) => {

            //         if (error) {
            //             console.log("Error running command:", stderr || error.message);
            //             reject(stderr || error.message)
            //             return
            //         }

            //         resolve(stdout.trim())
            //     });
            // })
            // .catch(err => {
            //     console.log("Error getting active player:", err);
            //     reject(err);
            // });

            const playerCommand = `playerctl ${command}`;
            console.log("Running command:", playerCommand);
            exec(playerCommand, (error, stdout, stderr) => {

                    if (error) {
                        console.log("Error running command:", stderr || error.message);
                        reject(stderr || error.message)
                        return
                    }

                    resolve(stdout.trim())
                });
        })
    }

    async getPlayers() {
        try {

            const output =
                await this.run('-l')

            return output
                .split('\n')
                .filter(Boolean)

        } catch (err) {
            console.log("Error getting players:", err)
            return []
        }
    }

    async getStatus() {

        try {

            const [
                status,
                title,
                artist,
                album,
                volume,
                players
            ] = await Promise.all([

                this.run('status'),
                this.run('metadata title'),
                this.run('metadata artist'),
                this.run('metadata album'),
                this.run('volume'),
                this.getPlayers()
            ])

            return {
                playing: status === 'Playing',
                status,
                title,
                artist,
                album,
                volume: Math.round(
                    parseFloat(volume) * 100
                ),
                players
            }

        } catch (err) {
            console.log("Error getting status:", err)
            return {
                playing: false,
                status: 'Stopped',
                title: null,
                artist: null,
                album: null,
                volume: 0,
                players: []
            }
        }
    }

    async getActivePlayer() {

        try {

            const players =
                await this.getPlayers()

            if (!players.length) {
                return null
            }

            // Prefer bluetooth players
            const preferred =
                players.find(player =>
                    player.includes('bluez')
                )

            return preferred || players[0]

        } catch (err) {
            console.log("Error getting active player:", err)
            return null
        }
    }

    async play() {
        return this.run('play')
    }

    async pause() {
        return this.run('pause')
    }

    async playPause() {
        return this.run('play-pause')
    }

    async next() {
        return this.run('next')
    }

    async previous() {
        return this.run('previous')
    }

    async setVolume(volume) {

        const normalized =
            Math.min(100,
            Math.max(0, volume)) / 100
        console.log("Setting volume to:", normalized)
        return this.run(
            `volume ${normalized}`
        )
    }
}

module.exports = new MediaService()