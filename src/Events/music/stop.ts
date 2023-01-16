import {Queue} from "../../Struct/Queue";

module .exports = {
    name: 'stop',
    once: false,

    execute: async (queue: Queue) => {
        queue.musicChannel?.send(`Stopped the song`);
    }
}