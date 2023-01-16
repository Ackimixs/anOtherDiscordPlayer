import {ChatInputCommandInteraction} from "discord.js";
import {Bot} from "../../Struct/Bot";
import {Queue} from "../../Struct/Queue";

module.exports = async (interaction: ChatInputCommandInteraction, client: Bot, queue: Queue) => {

    queue.skip();

    await interaction.reply({content: `Skip the song`});
}