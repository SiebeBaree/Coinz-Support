import { Client } from 'discord.js'

import config from "../assets/config.json" assert { type: "json" }

import CommandStore from "./CommandStore.js"
import EventStore from "./EventStore.js"
import Logger from './Logger.js'

export default class extends Client {
    constructor(options = {}) {
        super(options);

        this.config = config;
        this.logger = new Logger(this);
        this.commands = new CommandStore(this);
        this.events = new EventStore(this);
    }

    async login(token) {
        await Promise.all([
            this.events.loadFiles(),
            this.commands.loadFiles(),
            super.login(token)
        ]);
    }
}