import {Queue} from "../../Struct/Queue";
import {Track} from "../../Interface/Track";
import {EmbedBuilder} from "discord.js";

module.exports = {
    name: 'playNext',
    once: false,

    execute: async (queue: Queue, track: Track) => {

        const embed = new EmbedBuilder()
            .setTitle('Now Playing')
            .setURL(track.discordMessageUrl as string)
            .setThumbnail(track.avatarUrl as string)
            .setDescription(track.title)
            .setTimestamp(new Date())

        await queue.musicChannel?.send({embeds: [embed]});
    }
}