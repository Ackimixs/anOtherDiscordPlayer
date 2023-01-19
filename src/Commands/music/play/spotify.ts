import {ChatInputCommandInteraction, GuildMember, VoiceChannel} from "discord.js";
import {Bot} from "../../../Struct/Bot";
import {Queue} from "../../../Struct/Queue";
import {TrackType} from "../../../Interface/Track";
import {Album, Artist, parse, Playlist, Track as SpotifyUriTrack} from "spotify-uri";
import {Track as SpotifyApiTrack} from "spotify-api.js";
import {isUrl} from "../../../utils/function";

//TODO change everything because that is not optimal
module.exports = async (interaction: ChatInputCommandInteraction, client: Bot, queue: Queue) => {

    const query = interaction.options.getString('name', true);

    const member = interaction.member as GuildMember;

    const voiceChannel = member.voice.channel as VoiceChannel;

    await interaction.reply({content: `Searching music ...`, ephemeral: true});

    if(isUrl(query)) {
        const url = new URL(query);

        if (url.hostname.includes('spotify') || url.protocol.includes('spotify')) {
            const data = parse(query);
            if (data instanceof SpotifyUriTrack) {
                const track = await client.player.spotifyClient.searchTrack(data.id);
                if (!track) return interaction.followUp({content: 'No results found!', ephemeral: true});

                const ytTrack = await client.player.searchYoutubeTrack(`${track.name} ${track.artists[0].name}`);
                if (!ytTrack) return interaction.followUp({content: 'No results found!', ephemeral: true});
                ytTrack.type = TrackType.SPOTIFY;
                ytTrack.resource.volume?.setVolume(0.25);
                queue.addTrack(ytTrack);
                await interaction.followUp({content: `Add ${ytTrack.title} to Queue`, ephemeral: false});

            } else if (data instanceof Album) {
                const album = await client.player.spotifyClient.searchAlbum(data.id);
                if (!album?.tracks) return interaction.followUp({content: 'No results found!', ephemeral: true});
                const listTrack : any[] = [];
                for (const track of album.tracks) {
                    if (track?.name) {
                        console.log(track.name);
                        const ytTrack = await client.player.searchYoutubeTrack(`${track.name} ${track.artists[0].name}`);
                        if (ytTrack) {
                            ytTrack.type = TrackType.SPOTIFY;
                            ytTrack.resource.volume?.setVolume(0.25);
                            listTrack.push(ytTrack);
                        }
                    }
                }
                queue.addTracks(listTrack);
                await interaction.followUp({content: `Add ${album.name} to Queue - ${listTrack.length} tracks`, ephemeral: false});
            } else if (data instanceof Artist) {

                let topTrack = await client.player.spotifyClient.client.artists.getTopTracks(data.id);
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
                search.resource.volume?.setVolume(0.25);
                await interaction.followUp({content: `Add ${search.title} to Queue`, ephemeral: false});

            } else if (data instanceof Playlist) {
                const playlist = await client.player.spotifyClient.searchPlaylist(data.id);
                if (!playlist?.tracks) return interaction.followUp({content: 'No results found!', ephemeral: true});

                const listTrack : any[] = [];
                for (const track of playlist.tracks) {
                    if (track.track instanceof SpotifyApiTrack) {
                        const ytTrack = await client.player.searchYoutubeTrack(`${track.track?.name} ${track.track?.artists[0].name}`);
                        if (ytTrack) {
                            ytTrack.type = TrackType.SPOTIFY;
                            ytTrack.resource.volume?.setVolume(0.25);
                            listTrack.push(ytTrack);
                        }
                    } else if (track.track) {
                        const ytTrack = await client.player.searchYoutubeTrack(`${track.track?.name} ${track.track?.show?.name}`);
                        if (ytTrack) {
                            ytTrack.type = TrackType.SPOTIFY;
                            ytTrack.resource.volume?.setVolume(0.25);
                            listTrack.push(ytTrack);
                        }
                    }
                }
                await interaction.followUp({content: `Add ${playlist.name} to Queue - ${listTrack.length} tracks`, ephemeral: false});

            } else {
                return interaction.followUp({content: 'No results found!', ephemeral: true});
            }

        } else {
            return interaction.followUp({content: 'Invalid link please use official spotify or open issue on the github to inform my creator', ephemeral: true});
        }
    } else {
        const data = await client.player.spotifyClient.search(query);

        if (!data) return interaction.followUp({content: 'No results found!', ephemeral: true});

        if (data.tracks) {
            const track = data.tracks[0];
            if (!track?.name) return interaction.followUp({content: 'No results found!', ephemeral: true});
            const ytTrack = await client.player.searchYoutubeTrack(`${track.name} ${track.artists[0].name}`);
            if (!ytTrack) return interaction.followUp({content: 'No results found!', ephemeral: true});
            ytTrack.type = TrackType.SPOTIFY;
            ytTrack.resource.volume?.setVolume(0.25);
            queue.addTrack(ytTrack);

            await interaction.followUp({content: `Added ${ytTrack.title} to the queue!`, ephemeral: false});
        } else {
            return interaction.followUp({content: 'No results found!', ephemeral: true});
        }
    }

    if (!queue.connection) {
        queue.connect(voiceChannel);
    }

    if (!queue.playing) {
        setTimeout(() => {
            queue.play();
        }, 1000)
    }
}