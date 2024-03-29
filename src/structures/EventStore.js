import Store from './Store.js';

export default class extends Store {
    constructor(client) {
        super(client, 'events');
    }

    set(event) {
        super.set(event);
        this.client.on(event.name, event.run.bind(this.client));

        return event;
    }

    delete(name) {
        this.client.removeAllListeners(name);
        return super.delete(name);
    }

    clear() {
        for (let event of this.keys()) {
            this.delete(event);
        }
    }
}