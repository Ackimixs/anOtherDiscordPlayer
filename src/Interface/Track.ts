
export interface Track {
    title: string;
    description?: string;
    channelTitle?: string;
    url: string;
    duration?: number;
    thumbnail?: string;
    type: TrackType;
    discordMessageUrl?: string;
    avatarUrl?: string;
    twitchUrl?: string;
}

export enum TrackType {
    YOUTUBE = 'youtube',
    TWITCH = 'twitch',
    SUBSONIC = 'subsonic',
    SPOTIFY = 'spotify',
    SOUNDCLOUD = 'soundcloud',

}