import {ApplicationCommandOptionType, ChatInputCommandInteraction} from "discord.js";
import {Bot} from "../Struct/Bot";

module.exports = {
    name: "openai",
    description: "OpenAI",
    category: "Information",
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: "text",
            description: "text",
            required: true
        }
    ],

    execute: async (interaction: ChatInputCommandInteraction, client: Bot) => {
        const content = interaction.options.getString("text");

        if (client.openai) {
            const respone = await client.openai.createCompletion({
                model: "text-davinci-003",
                prompt: content,
                max_tokens: 100,
                temperature: 0.9
            });

            await interaction.reply({content: respone.data.choices[0].text || 'No response'});
        }
        await interaction.reply({content: 'OpenAI is not configured'});
    }
}