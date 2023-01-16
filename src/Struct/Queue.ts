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
import {Track, TrackType} from "../Interface/Track";
export class Queue extends EventEmitter {
    guildId: string
    client: Bot
    AudioPlayer: AudioPlayer
    connection: VoiceConnection | undefined
    resource: AudioResource | undefined
    private queue: Track[] = [];
    history: Track[] = [];
    player: Player
    playing: boolean = false;
    musicChannel: VoiceChannel | undefined
    trackType: TrackType | undefined;
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

        this.connection?.on(VoiceConnectionStatus.Disconnected, () => {
            console.log("Disconnected");
            this.stop();
        })

        this.player.on('stateChange', (oldState, newState) => {
            if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
                const previousTrack: Track = this.queue.shift() as Track;
                this.history.unshift(previousTrack);
                setTimeout(() => {
                    this.play();
                }, 1000);
            }
        })

        this.player.on('error', (error) => {
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

        this.connection.on(VoiceConnectionStatus.Ready, () => {
            this.emit('connect', this);
        });

        this.connection.subscribe(this.AudioPlayer);
    }
    addTrack(track: Track): void {
        this.queue.push(track);

        if (this.queue.length === 1) {
            this.play();
        }
    }

    addTracks(tracks: Track[]) {
        this.queue.push(...tracks);
    }

    setVolume(volume: number) {
        this.resource?.volume?.setVolume(volume);
    }


    stop() {
        this.playing = false;
        this.resource = undefined;
        this.queue = [];
        this.history = [];
        this.AudioPlayer.stop();
        this.connection?.destroy();
        this.emit('stop', this);
    }

     play() {
        if (this.queue.length > 0) {
            this.trackType = this.queue[0].type;
            this.AudioPlayer.play(this.queue[0].resource as AudioResource);
            this.playing = true;
            this.emit('playNext', this.queue[0]);
            this.resource = this.queue[0].resource;
        } else {
            this.playing = false;
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
        const previousTrack: Track = this.queue.shift() as Track;
        this.history.unshift(previousTrack);
        setTimeout(() => {
            this.play();
        }, 1000);
    }

    clear() {
        this.queue = [];
    }

    getQueue(): Track[] {
        return this.queue;
    }
}