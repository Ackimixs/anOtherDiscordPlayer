import {ChatInputCommandInteraction, EmbedBuilder, GuildMember} from "discord.js";
import {Bot} from "../../Struct/Bot";
import {Queue} from "../../Struct/Queue";
import {Track} from "../../Interface/Track";

module.exports = async (interaction: ChatInputCommandInteraction, client: Bot, queue: Queue) => {
    const query = interaction.options.getString('name', true);

    await interaction.reply({content: `Searching for **${query}**`, ephemeral: true});

    const member = interaction.member as GuildMember;

    if (!member?.voice.channel) return interaction.followUp({
        content: 'You need to be in a voice channel to use this command!',
        ephemeral: true
    });

    const voiceChannel = member.voice.channel;

    queue.connect(voiceChannel);

    const track: Track | null = await client.player.searchYoutubeTrack(query);

    if (!track) return interaction.followUp({
        content: 'No results found!',
        ephemeral: true
    })



    const embed = new EmbedBuilder()
        .setTitle('Youtube')
        .setImage(track.thumbnail as string)
        .setDescription(`Add to queue \`${track.title}\` by [${track.channelTitle}](${track.url} "The best youtuber ever")`)

    const result = await interaction.followUp({embeds: [embed]});

    track.discordMessageUrl = result.url;

    queue.addTrack(track);

    if (!queue.playing) {
        queue.play();
    }
}