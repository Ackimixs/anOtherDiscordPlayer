import fs from "node:fs";
import {Bot} from "../Struct/Bot";

module.exports = async (client: Bot) => {

    const commandFiles = fs.readdirSync(`./dist/Commands/`).filter(file => (file.endsWith('.js')));


    const CommandsArray: any[] = []

    commandFiles.map(async (file) => {

        const command = require(`../Commands/${file}`);

        await client.commands.set(command.name, command);
        CommandsArray.push(command);
    })


    client.once('ready', async () => {

        const guilds = await client.guilds.fetch();
        guilds.forEach(guild => {
            client.guilds.fetch(guild.id).then(guild => guild.commands.set(CommandsArray));
        })
    })

}