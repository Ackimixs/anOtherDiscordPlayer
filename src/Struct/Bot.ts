import {Client, ClientOptions, Collection} from "discord.js";
import { Configuration, OpenAIApi } from "openai";
import {Player} from "./Player";
import {TwitchApi} from "./TwitchApi";
import {config} from "../config";
export class Bot extends Client {
    commands: Collection<string, any>
    openai: OpenAIApi | null = null;
    player: Player
    twitchApi: TwitchApi;
    config: any = config;
    constructor(options: ClientOptions) {
        super(options);
        this.player = new Player(this);
        this.twitchApi = new TwitchApi(this);
        this.twitchApi.fetchToken().then(() => {});
        this.commands = new Collection()

        if (this.config.key.openai) {
            this.openai = new OpenAIApi(new Configuration({
                apiKey: this.config.key.openai,
            }));
        }
    }
}