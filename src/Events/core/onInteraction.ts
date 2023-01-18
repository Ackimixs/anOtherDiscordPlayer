import {Events, Interaction} from "discord.js";
import {Bot} from "../../Struct/Bot";

module.exports = {
    name: Events.InteractionCreate,
    once: false,

    execute: async (interaction: Interaction, client: Bot) => {

        if (interaction.isAutocomplete()) {

            let entry = interaction.options.getFocused();

            await client.commands.get(interaction.commandName)?.handleAutoComplete(interaction, client, entry);
        }

        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
        }
    }
}