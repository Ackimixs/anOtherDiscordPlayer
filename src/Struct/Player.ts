import {AudioResource, createAudioResource, StreamType} from "@discordjs/voice";
import {Bot} from "./Bot";
import {Collection} from "discord.js";
import {google, youtube_v3} from "googleapis";
import ytdl from "ytdl-core";
import {Queue} from "./Queue";
import EventEmitter from "node:events";
import {Track, TrackType} from "../Interface/Track";
import m3u8stream from "m3u8stream";
import {SpotifyApi} from "./SpotifyApi";

const twitch = require("twitch-m3u8");
export class Player extends EventEmitter {
    client: Bot
    youtube: youtube_v3.Youtube
    queue: Collection<string, Queue>;
    spotifyClient: SpotifyApi;
    constructor(client: Bot) {
        super();

        this.client = client;
        this.spotifyClient = new SpotifyApi(this);
        this.youtube = google.youtube({
            version: 'v3',
            auth: process.env.YOUTUBE_API_KEY
        })

        this.queue = new Collection<string, Queue>()

    }

    YoutubeSearch(query: string, maxResults: number = 3) : Promise<youtube_v3.Schema$SearchListResponse | undefined>  {
        return new Promise((resolve, reject) => {
            this.youtube.search.list({
                part: ['snippet'],
                q: query,
                type: ['video'],
                maxResults: maxResults
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    // @ts-ignore
                    resolve(data);
                }
            })
        })
    }
    async getYTDLAudio(videoId: string) {
        let info = await ytdl.getInfo(videoId);

        return ytdl.downloadFromInfo(info, {
            quality: 'highestaudio',
            filter: 'audioonly'
        });
    }


    searchYoutube(query: string, maxResults: number) : Promise<youtube_v3.Schema$SearchListResponse | undefined> {
        return new Promise(async (resolve, reject) => {
            const data: any = await this.YoutubeSearch(query, maxResults);

            if (!data || !data.data || !data.data.items) return reject('No data');
            const video = data.data.items;

            resolve(video);
        })
    }

    createResource(resource : any) {
        return createAudioResource(resource, {
            inlineVolume: true,
            metadata: {
                title: 'Best song',
            },
            inputType: StreamType.Arbitrary
        });
    }

    async searchYoutubeTrack(query: string) : Promise<Track | null> {
        const data: any = await this.YoutubeSearch(query, 1);

        if (!data?.data?.items || data.data.items.length < 1) return null;
        const video = data.data.items[0];

        const stream = await this.getYTDLAudio(video.id.videoId);

        const resource = this.createResource(stream);

        return {
            title: video.snippet.title,
            url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
            description: video.snippet.description,
            channelTitle: video.snippet.channelTitle,
            thumbnail: video.snippet.thumbnails.default.url,
            avatarUrl: video.snippet.thumbnails.default.url,
            duration: 0,
            resource: resource,
            type: TrackType.YOUTUBE
        }
    }

    async searchTwitchStreamTrack(username: string) : Promise<Track | null> {
        let stream: any[];

        stream = await twitch.getStream(username)

        if (!stream || stream.length === 0) return null;

        let track = stream.filter((item: any) => {return item.quality === 'audio_only'})[0];

        if (!track) track = stream[stream.length-1];

        if (track.url.length < 2) return null;

        const resource = this.createResource(m3u8stream(track.url));

        return {resource: resource, title: username + ' stream', channelTitle: username, url: 'https://www.twitch.tv/' + username.toLowerCase(), type: TrackType.TWITCH};
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

        queue.on("stop", (queue: Queue) => {
            this.emit("stop", queue);
        })

        queue.on('voiceConnectionConnected', (queue: Queue) => {
            this.emit('voiceConnectionConnected', queue);
        })

        queue.on('voiceConnectionDestroyed', (queue: Queue) => {
            this.emit('voiceConnectionDestroyed', queue);
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