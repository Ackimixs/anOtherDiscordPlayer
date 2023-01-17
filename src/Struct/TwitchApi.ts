import {Bot} from "./Bot";
import * as process from "process";

export class TwitchApi {
    discordClient: Bot;
    token: string = '';
    Client_id: string;
    Client_secret: string;
    constructor(client: Bot) {
        this.discordClient = client;
        this.Client_id = process.env.TWITCH_CLIENT_ID as string;
        this.Client_secret = process.env.TWITCH_CLIENT_SECRET as string;
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

        setTimeout(() => {
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
}