import EventEmitter from "node:events"
import {
    AudioPlayer, AudioPlayerStatus,
    AudioResource,
    createAudioPlayer,
    joinVoiceChannel,
    NoSubscriberBehavior, VoiceConnection, VoiceConnectionStatus
} from "@discordjs/voice";
import {Bot} from "./Bot";
import {VoiceBasedChannel, VoiceChannel} from "discord.js";
import {Player} from "./Player";
import {Track} from "../Interface/Track";
import {shuffleArray} from "../utils/function";
import m3u8stream from "m3u8stream";
import ytdl from "ytdl-core";
export class Queue extends EventEmitter {
    guildId: string
    client: Bot
    AudioPlayer: AudioPlayer
    connection: VoiceConnection | undefined
    actualResource: AudioResource | null = null;
    actualTrack: Track | null = null;
    private queue: Track[] = [];
    history: Track[] = [];
    player: Player
    playing: boolean = false;
    musicChannel: VoiceChannel | null = null;
    volume: number = 0.25;
    loop: loopMode = loopMode.OFF;
    constructor(client: Bot, guildId: string, player: Player) {
        super();

        this.AudioPlayer = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause
            }
        })

        this.client = client;
        this.guildId = guildId;
        this.player = player;

        this.AudioPlayer.on('stateChange', (oldState, newState) => {
            if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
                if (this.loop === loopMode.OFF) {
                    if (this.history.length > 5) {
                        this.history.pop();
                    }
                    this.history.unshift(this.queue.shift() as Track);
                }
                setTimeout(() => {
                    this.play();
                }, 1000);
            }
        })

        this.AudioPlayer.on('error', (error) => {
            console.log(error);
        })
    }

    connect(channel: VoiceBasedChannel) {
        this.musicChannel = channel as VoiceChannel;
        this.connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        this.connection.on(VoiceConnectionStatus.Connecting, () => {
            this.emit('voiceConnectionConnected', this);
        });

        this.connection.on(VoiceConnectionStatus.Destroyed, () => {
            this.emit('voiceConnectionDestroyed', this);
        })

        this.connection.subscribe(this.AudioPlayer);
    }
    addTrack(track: Track): void {
        this.queue.push(track);
    }

    addTracks(tracks: Track[]) {
        this.queue.push(...tracks);
    }

    getQueue(): Track[] {
        return this.queue;
    }

    setVolume(volume: number) {
        volume = Math.min(Math.max(volume, 0), 100);
        this.volume = volume/100;
        this.actualResource?.volume?.setVolume(volume/100);
    }

    getVolume(): number {
        return this.volume;
    }

    stop() {
        this.playing = false;
        this.actualResource = null;
        this.queue = [];
        this.history = [];
        this.AudioPlayer.stop();
        this.connection?.destroy();
        this.emit('stop', this);
    }

     play() {
        if (this.queue.length > 0) {

            switch (this.loop) {
                case loopMode.RANDOM:
                    this.actualTrack = this.queue[Math.floor(Math.random() * this.queue.length)];
                    break;
                case loopMode.OFF:
                    this.actualTrack = this.queue[0];
                    break;
                case loopMode.QUEUE:
                    this.actualTrack = this.queue[0];
                    this.queue.push(this.queue.shift() as Track);
                    break;
                case loopMode.TRACK:
                    break;
            }

            if (this.actualTrack?.type === 'twitch') {
                this.actualResource = this.player.createResource(m3u8stream(this.actualTrack.twitchUrl as string))
            } else {
                this.actualResource = this.player.createResource(ytdl(this.actualTrack?.url as string , this.client.config.player.ytdl_options))
            }

            if (!this.actualTrack) return;
            this.actualResource?.volume?.setVolume(this.volume);

            this.AudioPlayer.play(this.actualResource as AudioResource);
            this.playing = true;
            this.emit('playNext', this.actualTrack);
        } else {
            this.stop();
        }
    }

    pause() {
        this.AudioPlayer.pause();
    }

    resume() {
        this.AudioPlayer.unpause();
    }

    skip() {
        setTimeout(() => {
            if (this.loop === loopMode.OFF) {
                if (this.history.length > 5) {
                    this.history.pop();
                }
                this.history.unshift(this.queue.shift() as Track);
            }
            this.play();
        }, 1000);
    }

    getHistory(): Track[] {
        return this.history;
    }

    clear() {
        this.queue = [];
    }

    shuffle() {
        this.queue = shuffleArray(this.queue);
    }

    setLoopMode(mode: loopMode) {
        this.loop = mode;
    }

    getLoopMode(): loopMode {
        return this.loop;
    }
}

export enum loopMode {
    OFF = 0,
    RANDOM = 1,
    QUEUE = 2,
    TRACK = 3
}