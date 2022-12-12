import { parse } from 'path';

export default class {
    constructor(client, file) {
        this.client = client;
        this.file = file;
        this.name = parse(file).name;
        this.store = client.store;
    }

    reload() {
        return this.store.load(this.file);
    }
}