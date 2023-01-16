import {Client, ClientOptions, Collection} from "discord.js";
import { Configuration, OpenAIApi } from "openai";
import {Player} from "./Player";
import {TwitchApi} from "./TwitchApi";

export class Bot extends Client {
    commands: Collection<string, any>
    openai: OpenAIApi
    player: Player
    twitchApi: TwitchApi;
    constructor(options: ClientOptions) {
        super(options);
        this.player = new Player(this);
        this.twitchApi = new TwitchApi(this);
        this.twitchApi.fetchToken().then(() => {});
        this.commands = new Collection()
        this.openai = new OpenAIApi(new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        }));
    }
}