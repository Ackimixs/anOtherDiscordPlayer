require("dotenv").config();
const config = {
    key: {
        bot: process.env.BOT_TOKEN,
        openai: process.env.OPENAI_API_KEY,
        twitchClient: process.env.TWITCH_CLIENT_ID,
        twitchSecret: process.env.TWITCH_CLIENT_SECRET,
        spotifyClient: process.env.SPOTIFY_CLIENT_ID,
        spotifySecret: process.env.SPOTIFY_CLIENT_SECRET
    },
    openai: {
        channelToAutoReply: 'id',
    },
    player: {
        ytdl_options: {
            quality: 'highestaudio',
            highWaterMark: 1 << 25,
            filter: 'audioonly',
        }
    }
}

export {
    config
}