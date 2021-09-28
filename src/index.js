const { config } = require('dotenv')
config()

const Eris = require('eris')
const client = new Eris(process.env.TOKEN)
const axios = require('axios')
const { PlayerManager } = require('eris-lavalink')

client.on("ready", async() => {
    console.log(`Success logged in as ${client.user.username}`)

    let nodes = [
        { host: process.env['LAVA_HOST'], port: process.env['LAVA_PORT'], region: 'eu', password: process.env["LAVA_PASSWORD"] }
    ];

    let regions = {
        eu: ['eu', 'amsterdam', 'frankfurt', 'russia', 'hongkong', 'singapore', 'sydney'],
        us: ['us', 'brazil'],
    };

    if (!(client.voiceConnections instanceof PlayerManager)) {
        client.voiceConnections = new PlayerManager(client, nodes, {
            numShards: 1, // number of shards
            userId: client.user.id, // the user id of the bot
            regions: regions,
            defaultRegion: 'eu',
        });
    }

    const { data } = await axios.get(`http://${process.env['LAVA_HOST']}:${process.env['LAVA_PORT']}/loadtracks?identifier=${process.env['STREAM_URL']}`, { headers: { "Authorization": process.env["LAVA_PASSWORD"] } })

    const player = await client.joinVoiceChannel(process.env['CHANNEL_ID'], {})
    player.play(data.tracks[0].track)

    player.on("stuck", () => {
        player.play(data.tracks[0].track)
    })
})

client.connect()
