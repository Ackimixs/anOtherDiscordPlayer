import {Queue} from "../../Struct/Queue";

module.exports = {
    name: 'connect',
    once: false,

    execute: async (queue: Queue) => {

        console.log("Connected to voice channel : " + queue.musicChannel?.id);

    }
}