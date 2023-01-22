import {Client as SpotifyClient, ClientSearchOptions} from "spotify-api.js";
import {Player} from "./Player";
import {Bot} from "./Bot";

export class SpotifyApi {
    player: Player;
    client: SpotifyClient;
    bot: Bot;
    constructor(player: Player, client: Bot) {
        this.player = player;
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