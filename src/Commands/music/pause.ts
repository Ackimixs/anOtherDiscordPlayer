import {ChatInputCommandInteraction} from "discord.js";
import {Bot} from "../../Struct/Bot";
import {Queue} from "../../Struct/Queue";

module.exports = async (interaction: ChatInputCommandInteraction, client: Bot, queue: Queue) => {

    const mode = interaction.options.getString("mode", true);

    switch (mode) {
        case "pause":
            queue.pause();
            await interaction.reply({content: `Paused the song`});
            break;
        case "resume":
            queue.resume();
            await interaction.reply({content: `Resumed the song`});
            break;
        default:
            await interaction.reply({content: `Invalid mode`});
    }
}