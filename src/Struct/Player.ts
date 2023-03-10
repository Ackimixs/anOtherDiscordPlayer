import {AudioResource, createAudioResource, StreamType} from "@discordjs/voice";
import {Bot} from "./Bot";
import {Collection} from "discord.js";
import {Queue} from "./Queue";
import EventEmitter from "node:events";
import {Track, TrackType} from "../Interface/Track";
import {SpotifyApi} from "./SpotifyApi";
import YouTube from "youtube-sr";

const twitch = require("twitch-m3u8");
export class Player extends EventEmitter {
    client: Bot
    queue: Collection<string, Queue>;
    spotifyClient: SpotifyApi;
    constructor(client: Bot) {
        super();
        this.client = client;
        this.spotifyClient = new SpotifyApi(client);
        this.queue = new Collection<string, Queue>()
    }

    createResource(resource : any) {
        return createAudioResource(resource, {
            inlineVolume: true,
            inputType: StreamType.Arbitrary
        });
    }

    async searchYoutubeTrackById(id: string) : Promise<Track | null>{
        const track = await YouTube.search(id, {type: 'video', limit: 1});

        if (!track) return null;

        return {
            title: track[0].title || 'No title',
            channelTitle: track[0].channel!.name!,
            url: track[0].url,
            type: TrackType.YOUTUBE,
            thumbnail: track[0].thumbnail?.url,
            avatarUrl: track[0].channel!.icon.url,
            duration: track[0].duration,
            description: track[0].description
        }
    }

    async searchYoutubeTrack(query: string, limit: number = 1) : Promise<Track | null>{
        const search = await YouTube.search(query, {type: 'video', limit});

        if (search.length === 0) return null;

        return {
            title: search[0].title || 'No title',
            channelTitle: search[0].channel!.name!,
            url: search[0].url,
            type: TrackType.YOUTUBE,
            thumbnail: search[0].thumbnail?.url,
            avatarUrl: search[0].channel!.icon.url,
            duration: search[0].duration,
            description: search[0].description
        }
    }

    async searchTwitchStreamTrack(username: string) : Promise<Track | null> {
        let stream: any[];

        stream = await twitch.getStream(username)

        if (!stream || stream.length === 0) return null;

        let track = stream.filter((item: any) => {return item.quality === 'audio_only'})[0];

        if (!track) track = stream[stream.length-1];

        if (track.url.length < 2) return null;

        return { title: username + ' stream', channelTitle: username, url: 'https://www.twitch.tv/' + username.toLowerCase(), twitchUrl: track.url, type: TrackType.TWITCH};
    }


    getQueue(guildId: string) {
        return this.queue.get(guildId);
    }

    createQueue(guildId: string) {
        const queue = new Queue(this.client as Bot, guildId, this);
        this.setQueue(guildId, queue);

        queue.on('playNext', (track: AudioResource) => {
            this.emit('playNext', queue, track);
        })

        queue.on("stop", (q: Queue) => {
            this.emit("stop", q);
        })

        queue.on('voiceConnectionConnected', (q: Queue) => {
            this.emit('voiceConnectionConnected', q);
        })

        queue.on('voiceConnectionDestroyed', (q: Queue) => {
            this.emit('voiceConnectionDestroyed', q);
        })

        this.setQueue(guildId, queue);
    }

    setQueue(guildId: string, queue: Queue) {
        this.queue.set(guildId, queue);
    }
    deleteQueue(guildId: string) {
        this.queue.delete(guildId);
    }
}