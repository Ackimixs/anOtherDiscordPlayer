import {Events} from "discord.js";
import {Bot} from "../../Struct/Bot";

module.exports = {
    name: Events.ClientReady,
    once: true,

    execute: async (client: Bot) => {
        console.log(`Logged in as ${client.user?.tag}!`);


        client.guilds.fetch().then(guilds => {
            guilds.forEach(guild => {
                client.player.createQueue(guild.id);
            })
        })
    }
}