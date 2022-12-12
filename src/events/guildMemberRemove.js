import Event from '../structures/Event.js';
import { WebhookClient } from 'discord.js';

export default class extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(member) {
        const webhookClient = new WebhookClient({ id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN });
        await webhookClient.send({
            content: `<:member_leave:1051512749756264448> **${member.user.tag}** has left the server.`,
            username: member.user.username,
            avatarURL: member.user.displayAvatarURL()
        });
    }
}