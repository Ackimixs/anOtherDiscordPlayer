import {Events, VoiceChannel} from "discord.js";
import {Bot} from "../../Struct/Bot";

module.exports = {
    name: Events.ClientReady,
    once: true,

    execute: async (client: Bot) => {
        console.log(`Logged in as ${client.user?.tag}!`);
    }
}