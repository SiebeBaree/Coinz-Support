import Event from "../structures/Event.js"

export default class extends Event {
    constructor(...args) {
        super(...args);
    }

    async run() {
        this.logger.ready(`Client has loaded.`);
    }
}