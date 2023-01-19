import {Events} from "discord.js";
import {Bot} from "../../Struct/Bot";
import {deleteFile} from "../../utils/function";

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

        await deleteFile('youtube.json');
        setInterval(() => {
            deleteFile('youtube.json');
        }, 1000 * 60 * 60 * 24 * 2);
    }
}