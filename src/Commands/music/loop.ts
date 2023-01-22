import {ChatInputCommandInteraction} from "discord.js";
import {Bot} from "../../Struct/Bot";
import {loopMode, Queue} from "../../Struct/Queue";

module.exports = async (interaction: ChatInputCommandInteraction, client: Bot, queue: Queue) => {

    const mode = interaction.options.getInteger('mode', true) as loopMode;

    queue.setLoopMode(mode);

    await interaction.reply({content: `Loop mode set to ${mode === loopMode.OFF ? 'off' : mode === loopMode.TRACK  ? 'track' : mode === loopMode.QUEUE ? 'queue' : 'random'}`});
}