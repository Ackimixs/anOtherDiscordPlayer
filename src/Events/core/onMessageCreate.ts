import {Events, Message} from "discord.js";
import {Bot} from "../../Struct/Bot";

module.exports = {
    name: Events.MessageCreate,
    once: false,

    execute: async (message: Message, client: Bot) => {
        if (message.author.bot) return;

        if (message.channel.id === '1062822644438810704') {
            const content = message.content;

            const respone = await client.openai.createCompletion({
                model: "text-davinci-003",
                prompt: content,
                max_tokens: 100,
                temperature: 0.9
            });

            await message.channel.send(respone.data.choices[0].text as string);
        }
    }
}