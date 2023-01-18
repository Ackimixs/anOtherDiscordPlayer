import { ChatInputCommandInteraction} from "discord.js";
import {Bot} from "../Struct/Bot";

module.exports = {
    name: "ping",
    description: "Display the ping",
    category: "Information",

    async execute(interaction: ChatInputCommandInteraction, client: Bot) {
        await interaction.reply({content: `Pong!`, ephemeral: false});
        const msg = await interaction.fetchReply();
        await interaction.editReply({content: `Bot websocket ping : ${client.ws.ping}ms \nReal ping : ${msg.createdTimestamp - interaction.createdTimestamp}ms`});
    }
}