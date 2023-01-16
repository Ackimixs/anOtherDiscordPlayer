import {AudioResource} from "@discordjs/voice";

export interface Track {
    title: string;
    description?: string;
    channelTitle?: string;
    url: string;
    duration?: number;
    thumbnail?: string;
    resource: AudioResource;
    type: TrackType;
    discordMessageUrl?: string;
    avatarUrl?: string;
}

export enum TrackType {
    YOUTUBE = 'youtube',
    TWITCH = 'twitch',
    SUBSONIC = 'subsonic',
    SPOTIFY = 'spotify',
    SOUNDCLOUD = 'soundcloud',

}