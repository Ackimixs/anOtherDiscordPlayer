import {ChatInputCommandInteraction} from "discord.js";
import {Bot} from "../../Struct/Bot";
import {Queue} from "../../Struct/Queue";

module.exports = async (interaction: ChatInputCommandInteraction, client: Bot, queue: Queue) => {

    const volume = interaction.options.getInteger('volume', true);

    if (volume > 100) return interaction.reply({
        content: 'Volume must be less than 100',
        ephemeral: true
    })

    if (volume < 0) return interaction.reply({
        content: 'Volume must be greater than 0',
        ephemeral: true
    })

    queue.setVolume(volume);

    await interaction.reply({content: `Volume set to ${volume}`});
}