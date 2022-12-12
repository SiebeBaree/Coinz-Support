import Command from "../../structures/Command.js"
import { ApplicationCommandOptionType } from "discord.js"
import Premium from "../../schemas/Premium.js"

export default class extends Command {
    info = {
        name: "set-premium",
        description: "Set a user's premium status.",
        options: [
            {
                name: 'option',
                type: ApplicationCommandOptionType.String,
                description: 'The option you want to set.',
                required: true,
                choices: [
                    {
                        name: "Disabled",
                        value: "0",
                        focused: true
                    },
                    {
                        name: "User",
                        value: "1"
                    },
                    {
                        name: "Guild I",
                        value: "2"
                    },
                    {
                        name: "Guild II",
                        value: "3"
                    }
                ]
            },
            {
                name: 'user-id',
                type: ApplicationCommandOptionType.String,
                description: 'The user you want to set the premium status for.',
                required: true
            },
            {
                name: 'expires-in',
                type: ApplicationCommandOptionType.Integer,
                description: 'The amount of days the premium status should last. Default = 30 days.',
                required: false,
                min_value: 1,
                max_value: 9999
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
        const premiumType = parseInt(interaction.options.getString('option')) ?? 0;
        const id = interaction.options.getString('user-id');
        const expiresIn = interaction.options.getInteger('expires-in') ?? 30;

        const premium = await Premium.findOne({ id: id });
        if (premium && premium.premium === true && premiumType > 0) {
            await Premium.updateOne(
                { id: id },
                {
                    $set: { premiumType: premiumType, maximumGuilds: premiumType === 3 ? 3 : premiumType === 2 ? 1 : 0 },
                    $inc: { premiumExpiresAt: expiresIn * 86400 }
                }
            );
        } else {
            await Premium.updateOne(
                { id: id },
                {
                    $set: {
                        premium: premiumType > 0,
                        premiumType: premiumType,
                        premiumExpiresAt: premiumType > 0 ? Math.floor(Date.now() / 1000) + (expiresIn * 86400) : 0,
                        maximumGuilds: premiumType === 3 ? 3 : premiumType === 2 ? 1 : 0
                    }
                },
                { upsert: true }
            );
        }

        await interaction.reply({ content: `User ${id} has been ${premiumType !== 0 ? "given" : "removed from"} premium status.`, ephemeral: true });
    }
}