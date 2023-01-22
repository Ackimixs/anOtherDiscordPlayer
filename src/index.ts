import fs from "fs";
import {Bot} from "./Struct/Bot";

const { GatewayIntentBits } = require("discord-api-types/v10");
const { Partials, Collection } = require("discord.js");

require('dotenv').config();

(async () => {
    const client = new Bot({
        intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.Guilds, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.MessageContent],
        partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User, Partials.GuildScheduledEvent],
        allowedMentions: { parse: ["everyone", "users", "roles"] },
        presence: {activities: [{ name: "Hi everyone" }], status: "online"}
    })

    client.commands = new Collection();

    //Handler
    const files = fs.readdirSync(`./dist/Handlers`);

    files.forEach(file => {
        require(`./Handlers/${file}`)(client)
    })

    await client.login(client.config.key.bot);
})()
