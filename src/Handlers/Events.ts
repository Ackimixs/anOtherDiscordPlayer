import fs from "fs";
import {Bot} from "../Struct/Bot";

module.exports = async (client: Bot) => {

    fs.readdirSync(`./dist/Events/`).forEach(dirs => {
        const eventFiles = fs.readdirSync(`./dist/Events/${dirs}`).filter(file => file.endsWith('.js'));
        //console.log(eventFiles)
        const handler = (dirs === 'core' ? client : dirs === 'music' ? client.player : undefined);
        for (const file of eventFiles) {
            const event = require(`../Events/${dirs}/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                handler?.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    });
}