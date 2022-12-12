import Command from "../../structures/Command.js"
import { ApplicationCommandOptionType } from "discord.js"
import Member from "../../schemas/Member.js"

export default class extends Command {
    info = {
        name: "add-badge",
        description: "Add a badge to a user's profile.",
        options: [
            {
                name: 'user-id',
                type: ApplicationCommandOptionType.String,
                description: 'The user ID you want to add the badge to.',
                required: true
            },
            {
                name: 'badge',
                type: ApplicationCommandOptionType.String,
                description: 'The badge you want to add to the user\'s profile.',
                required: true
            }
        ],
        category: "admin",
        extraFields: [],
        enabled: true,
        deferReply: false
    };

    constructor(...args) {
        super(...args);
    }

    async run(interaction) {
        const userId = interaction.options.getString('user-id');
        const member = await Member.findOne({ id: userId });
        const badge = interaction.options.getString('badge');

        if (!member) return await interaction.reply({ content: `That user doesn't have a profile.`, ephemeral: true });
        if (member.badges.includes(badge)) return await interaction.reply({ content: `That user already has that badge.`, ephemeral: true });

        await Member.updateOne({ id: userId }, { $push: { badges: badge } });
        await interaction.reply({ content: `Added the ${badge} badge to ${userId}'s profile.`, ephemeral: true });
    }
}