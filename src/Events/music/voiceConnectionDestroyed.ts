import {Queue} from "../../Struct/Queue";

module.exports = {
    name: 'voiceConnectionDestroyed',
    once: false,

    execute: async (queue: Queue) => {

        console.log("Disconnected from voice channel : " + queue.musicChannel?.id);

    }
}