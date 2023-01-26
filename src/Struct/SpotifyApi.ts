import {Client as SpotifyClient, ClientSearchOptions} from "spotify-api.js";
import {Bot} from "./Bot";

export class SpotifyApi {
    client: SpotifyClient;
    bot: Bot;
    access_token: string = '';
    constructor(client: Bot) {
        this.bot = client;
        this.client = new SpotifyClient({ token: { clientID: this.bot.config.key.spotifyClient, clientSecret: this.bot.config.key.spotifySecret } });
    }

    async searchTrack(query: string) {
        return await this.client.tracks.get(query);
    }

    async searchArtist(query: string) {
        return await this.client.artists.get(query);
    }

    async searchAlbum(query: string) {
        return await this.client.albums.get(query);
    }

    async searchPlaylist(query: string) {
        return await this.client.playlists.get(query);
    }

    async search(query: string, limit: number = 1) {
        const options : ClientSearchOptions = {
            limit,
            offset: 0,
            types: ['album' , 'artist' , 'track' , 'episode']
        }
        return await this.client.search(query, options);
    }
}