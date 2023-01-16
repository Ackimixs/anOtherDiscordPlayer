import {ChatInputCommandInteraction} from "discord.js";
import {Bot} from "../Struct/Bot";

module.exports = {
    name: "ping",
    description: "Display the ping",
    category: "Information",

    async execute(interaction: ChatInputCommandInteraction, client: Bot) {
        return interaction.reply({content: 'pong'});
    }
}