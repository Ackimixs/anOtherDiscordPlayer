import {Bot} from "../Struct/Bot";
import {ApplicationCommandOptionType, ChatInputCommandInteraction} from "discord.js";
import {SpotifyType} from "../Struct/SpotifyApi";

module.exports = {
    name: "music",
    description: "music system",
    category: "Music",
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "youtube",
            description: "Play a track from youtube",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "name",
                    description: "name",
                    required: true
                }
            ]
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "stop",
            description: "Stop the song"
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "volume",
            description: "Change the volume",
            options: [
                {
                    type: ApplicationCommandOptionType.Integer,
                    name: "volume",
                    description: "Volume",
                    required: true
                }
            ]
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "pause",
            description: "Pause the song",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "mode",
                    description: "Mode",
                    required: true,
                    choices: [
                        {
                            name: "pause",
                            value: "pause"
                        },
                        {
                            name: "resume",
                            value: "resume"
                        }
                    ]
                }
            ]
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "skip",
            description: "Skip the song"
        },
        {
            type: ApplicationCommandOptionType.SubcommandGroup,
            name: "twitch",
            description: "Play a twitch stream",
            options: [
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: "play",
                    description: "Play a twitch stream",
                    options: [
                        {
                            type: ApplicationCommandOptionType.String,
                            name: "username",
                            description: "username",
                            required: true
                        }
                    ]
                },
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: "search",
                    description: "Search a twitch stream",
                    options: [
                        {
                            type: ApplicationCommandOptionType.String,
                            name: "user_login",
                            description: "user_login",
                            required: false
                        },
                        {
                            type: ApplicationCommandOptionType.String,
                            name: "language",
                            description: "language",
                            required: false,
                            choices: [
                                {
                                    name: "English",
                                    value: "en"
                                },
                                {
                                    name: "Francais",
                                    value: "fr",
                                },
                                {
                                    name: "Español",
                                    value: "es"
                                }
                                ]
                        },
                        {
                            type: ApplicationCommandOptionType.Boolean,
                            name: "type",
                            description: "live or not",
                            required: false,
                            choices: [
                                {
                                    name: "live",
                                    value: true
                                },
                                {
                                    name: "all",
                                    value: false
                                }
                            ]
                        },
                        {
                            type: ApplicationCommandOptionType.Integer,
                            name: 'limit',
                            description: 'limit',
                            required: false
                        }
                    ]
                }
            ]
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "queue",
            description: "Show the queue"
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "spotify",
            description: "Play a track from spotify",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "name",
                    description: "name",
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: "type",
                    description: "type",
                    required: true,
                    choices: [
                        {
                            name: "track",
                            value: SpotifyType.Track
                        },
                        {
                            name: "album",
                            value: SpotifyType.Album
                        },
                        {
                            name: "playlist",
                            value: SpotifyType.Playlist
                        },
                        {
                            name: "artist",
                            value: SpotifyType.Artist
                        }
                    ]
                }
            ]
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "testing",
            description: "testing"
        }
    ],

    execute: async (interaction: ChatInputCommandInteraction, client: Bot) => {
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();

        const queue = client.player.getQueue(interaction.guildId!);

        require(`./music/${subcommandGroup ? subcommandGroup + '/' : ''}${subcommand}`)(interaction, client, queue);
    }
}