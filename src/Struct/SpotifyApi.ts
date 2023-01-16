import { Client as SpotifyClient, Artist, Track, Album, Playlist } from "spotify-api.js";
import {Player} from "./Player";

export class SpotifyApi {
    player: Player;
    client: SpotifyClient;
    constructor(player: Player) {
        this.player = player;
        this.client = new SpotifyClient({ token: { clientID: process.env.SPOTIFY_CLIENT_ID as string, clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string } });
    }

    async searchTrack(query: string) {
        const track : Track[] = await this.client.tracks.search(query);
        return track;
    }

    async searchArtist(query: string) {
        const artist : Artist[] = await this.client.artists.search(query);
        return artist;
    }

    async searchAlbum(query: string) {
        const album : Album[] = await this.client.albums.search(query);
        return album;
    }
}

export enum SpotifyType {
    Album = "album",
    Artist = "artist",
    Playlist = "playlist",
    Track = "track"
}

export type AllSpotify = Artist[] | Track[] | Album[] | Playlist[];