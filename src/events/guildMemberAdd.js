import Event from '../structures/Event.js';
import { WebhookClient } from 'discord.js';

async function giveRole(member, roleId) {
    const role = member.guild.roles.cache.get(roleId);
    await member.roles.add(role);
}

export default class extends Event {
    MINIMUM_DAYS = 7; // use 0 to disable

    constructor(...args) {
        super(...args);
    }

    async run(member) {
        try {
            // Check for suspicious accounts
            if (member.user.avatarURL() === null || member.user.createdTimestamp >= Date.now() - (86400 * this.MINIMUM_DAYS)) {
                await giveRole(member, this.config.roleId.quarantine);
            }
        } catch (e) {
            bot.logger.error(`Failed to give Quarantine role to ${member.user.tag}`);
        }

        const webhookClient = new WebhookClient({ id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN });
        await webhookClient.send({
            content: `<:member_join:939891720378798150> **${member.user.tag}** has joined the server.`,
            username: member.user.username,
            avatarURL: member.user.displayAvatarURL()
        });
    }
}