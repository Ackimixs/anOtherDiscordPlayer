import {Bot} from "./Bot";

export class TwitchApi {
    client: Bot;
    token: string = '';
    Client_id: string;
    Client_secret: string;
    constructor(client: Bot) {
        this.client = client;
        this.Client_id = this.client.config.key.twitchClient;
        this.Client_secret = this.client.config.key.twitchSecret;
    }

    async fetchToken() {
        const data = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${this.Client_id}&client_secret=${this.Client_secret}&grant_type=client_credentials`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .catch(err => console.error(err));

        console.log("Fetch Twitch token success");

        this.token = data.access_token;

        setInterval(() => {
            this.fetchToken();
        }, 86400000);
    }

    async fetchChannel(userId: string) {
        return await fetch(`https://api.twitch.tv/helix/channels?broadcaster_id=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Client-Id': this.Client_id
            }
        })
            .then(res => res.json())
            .catch(err => console.error(err));
    }
    async fetchUser(username: string) {
        return await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Client-Id': this.Client_id
            }
        }).then(res => res.json())
            .catch(err => console.error(err));
    }

    async fetchStream(option: {language: string | null, user_login: string | null, type: string | null, user_id: string | null, limit: number | null}) {
        return await fetch(`https://api.twitch.tv/helix/streams?${option.user_id ? 'user_id=' + option.user_id + '&' : ''}${option.language ? 'language=' + option.language + '&' : ''}${option.user_login ? 'user_login=' + option.user_login + '&' : ''}${option.type ? 'type=' + option.type + '&' : ''}${option.limit ? 'first=' + option.limit : '5'}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Client-Id': this.Client_id
            }
        }).then(res => res.json())
            .catch(err => console.error(err));
    }

    async fetchQuery(query: string, maxResults: number = 5, isLive: boolean = true) {
        return await fetch(`https://api.twitch.tv/helix/search/channels?query=${query}&first=${maxResults}&live_only=${isLive}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Client-Id': this.Client_id
            }
        }).then(res => res.json())
            .catch(err => console.error(err));
    }
}