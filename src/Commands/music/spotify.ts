import {ChatInputCommandInteraction, GuildMember, VoiceChannel} from "discord.js";
import {Bot} from "../../Struct/Bot";
import {Queue} from "../../Struct/Queue";
import {SpotifyType} from "../../Struct/SpotifyApi";
import {Album, Artist, Playlist, Track as SpotifyTrack} from "spotify-api.js";
import {Track, TrackType} from "../../Interface/Track";

module.exports = async (interaction: ChatInputCommandInteraction, client: Bot, queue: Queue) => {

    const query = interaction.options.getString('name', true);

    const type = interaction.options.getString('type', true);

    const member = interaction.member as GuildMember;

    const voiceChannel = member.voice.channel as VoiceChannel;

    await interaction.reply({content: `Searching for **${query}**`, ephemeral: true});

    let track : AllSpotify = await client.player.searchSpotify(query, type as SpotifyType);

    if (!track) return interaction.followUp({
        content: 'No results found!',
    })

    if (track[0] instanceof SpotifyTrack) {
        let search = await client.player.searchYoutubeTrack(`${track[0].name} ${track[0].artists[0].name}`);
        if (!search) return interaction.followUp({
            content: 'No results found!',
        })
        search.type = TrackType.SPOTIFY;
        queue.addTrack(search);
    }
    else if (track[0] instanceof Artist) {
        let topTrack = await client.player.spotifyClient.client.artists.getTopTracks(track[0].id);
        if (!topTrack) return interaction.followUp({
            content: 'No results found!',
            ephemeral: true
        })
        const rand = Math.floor(Math.random()*(topTrack.length < 10 ? topTrack.length : 10));
        let search = await client.player.searchYoutubeTrack(`${topTrack[rand].name} ${topTrack[rand].artists[0].name}`);
        if (!search) return interaction.followUp({
            content: 'No results found!',
            ephemeral: true
        })
        search.type = TrackType.SPOTIFY;
        queue.addTrack(search);
    }
    else if (track[0] instanceof Album) {
        let t = await track[0].tracks;
        if (!t) return interaction.followUp({
            content: 'No results found!',
            ephemeral: true
        })
        const list: Track[] = [];
        for (const track of t) {
            let search = await client.player.searchYoutubeTrack(`${track.name} ${track.artists[0].name}`);
            if (search) {
                search.type = TrackType.SPOTIFY;
                list.push(search);
            }
        }
        queue.addTracks(list);
    }

    if (!queue.connection) await queue.connect(voiceChannel);

    if (!queue.playing) {
        queue.play();
    }

    await interaction.followUp({content: `Under construction`});
}

export type AllSpotify = Artist[] | Track[] | Album[] | Playlist[];