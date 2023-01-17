import {ChatInputCommandInteraction, EmbedBuilder, GuildMember, VoiceBasedChannel} from "discord.js";
import {Bot} from "../../../Struct/Bot";
import {Queue} from "../../../Struct/Queue";
import {Track} from "../../../Interface/Track";

module.exports = async (interaction: ChatInputCommandInteraction, client: Bot, queue: Queue) => {

    const username = interaction.options.getString('username', true);

    await interaction.reply({content: `Searching for **${username}**`, ephemeral: true});

    const member = interaction.member as GuildMember;

    if (!member?.voice.channel) return interaction.followUp({
        content: 'You need to be in a voice channel to use this command!',
        ephemeral: true
    });

    //TODO put that in the class and handle it
    let user: any = (await client.twitchApi.fetchUser(username)).data[0];

    if (!user) return interaction.followUp({
        content: 'No results found!',
        ephemeral: true
    });

    let stream = (await client.twitchApi.fetchStream({user_id: user.id, user_login: null, type: null, language: null, limit: 2}))?.data[0];

    if (!stream) return interaction.followUp({content: 'The streamer you requested is offline !', ephemeral: true});

    const voiceChannel = member.voice.channel as VoiceBasedChannel;

    queue.connect(voiceChannel);

    let track : Track | null = await client.player.searchTwitchStreamTrack(username);

    if (!track?.resource) return interaction.followUp({content: 'No stream found! Streamer maybe offline', ephemeral: true});

    track.title = stream.title;
    track.thumbnail = stream.thumbnail_url.replace('{width}', '1920').replace('{height}', '1080') as string;
    track.avatarUrl = user.profile_image_url;

    const embed = new EmbedBuilder()
        .setTitle('Twitch Stream')
        .setImage(track.thumbnail)
        .setDescription(`Add to queue \`${track.title}\` by [${track.channelTitle}](${track.url} "The best streamer ever")`)

    const result = await interaction.followUp({embeds: [embed]});

    track.discordMessageUrl = result.url;

    queue.addTrack(track);

    if (!queue.playing) {
        queue.play();
    }
}