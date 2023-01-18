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
export class Queue extends EventEmitter {
    guildId: string
    client: Bot
    AudioPlayer: AudioPlayer
    connection: VoiceConnection | undefined
    actualTrack: Track | null = null;
    private queue: Track[] = [];
    history: Track[] = [];
    player: Player
    playing: boolean = false;
    musicChannel: VoiceChannel | null = null;
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
                const previousTrack: Track = this.queue.shift() as Track;
                this.history.unshift(previousTrack);
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
        this.actualTrack?.resource?.volume?.setVolume(volume);
    }

    stop() {
        this.playing = false;
        this.actualTrack = null;
        this.queue = [];
        this.history = [];
        this.AudioPlayer.stop();
        this.connection?.destroy();
        this.emit('stop', this);
    }

     play() {
        if (this.queue.length > 0) {
            this.actualTrack = this.queue[0];
            this.AudioPlayer.play(this.actualTrack.resource as AudioResource);
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
        const previousTrack: Track = this.queue.shift() as Track;
        this.history.unshift(previousTrack);
        setTimeout(() => {
            this.play();
        }, 1000);
    }

    clear() {
        this.queue = [];
    }

    shuffle() {
        this.queue = shuffleArray(this.queue);
    }
}