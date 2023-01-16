import {Queue} from "../../Struct/Queue";
import {Track} from "../../Interface/Track";
import {ChatInputCommandInteraction} from "discord.js";
import {Bot} from "../../Struct/Bot";

module.exports = async (interaction: ChatInputCommandInteraction, client: Bot, queue: Queue) => {

    const track : Track[] = queue.getQueue();

    if (track.length === 0) return interaction.reply({content: `No track in queue`, ephemeral: true});

    let message = '';

    track.forEach((track, index) => {
        message += `${index + 1}. **${track.type}** -  ${track.title} - **${track.channelTitle}**\n`
    })

    await interaction.reply({content: message, ephemeral: true});
}