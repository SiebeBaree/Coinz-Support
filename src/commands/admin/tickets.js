import Command from "../../structures/Command.js"
import { ApplicationCommandOptionType } from "discord.js"
import Member from "../../schemas/Member.js"

export default class extends Command {
    info = {
        name: "tickets",
        description: "Add or remove a tickets from a user's profile.",
        options: [
            {
                name: 'add',
                type: ApplicationCommandOptionType.Subcommand,
                description: 'Add tickets to a user\'s profile.',
                options: [
                    {
                        name: 'user',
                        type: ApplicationCommandOptionType.User,
                        description: 'The user you want to add the tickets to.',
                        required: true
                    },
                    {
                        name: 'amount',
                        type: ApplicationCommandOptionType.Integer,
                        description: 'The amount of tickets you want to add.',
                        required: false,
                        min_value: 1,
                        max_value: 9999
                    }
                ]
            },
            {
                name: 'remove',
                type: ApplicationCommandOptionType.Subcommand,
                description: 'Remove tickets from a user\'s profile.',
                options: [
                    {
                        name: 'user',
                        type: ApplicationCommandOptionType.User,
                        description: 'The user you want to remove the tickets from.',
                        required: true
                    },
                    {
                        name: 'amount',
                        type: ApplicationCommandOptionType.Integer,
                        description: 'The amount of tickets you want to remove.',
                        required: false,
                        min_value: 1,
                        max_value: 10000
                    }
                ]
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
        const user = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount') || 1;
        const option = interaction.options.getSubcommand();

        const member = await Member.findOne({ id: user.id });
        if (!member) return await interaction.reply({ content: `Sorry, I couldn't find a user with the ID \`${user.id}\`.`, ephemeral: true });

        await Member.updateOne({ id: user.id }, { $inc: { tickets: option === "remove" ? -amount : amount } });
        await interaction.reply({ content: `Successfully ${option === "add" ? "added" : "removed"} \`${amount}\` tickets ${option === "add" ? "to" : "from"} \`${user.tag}\`'s profile.`, ephemeral: true });
    }
}