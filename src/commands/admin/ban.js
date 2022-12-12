import Command from "../../structures/Command.js"
import { ApplicationCommandOptionType } from "discord.js"
import Guild from "../../schemas/Guild.js"
import Member from "../../schemas/Member.js"

export default class extends Command {
    info = {
        name: "ban",
        description: "Ban/Unban a User/Guild from using the bot. (Toggle)",
        options: [
            {
                name: 'option',
                type: ApplicationCommandOptionType.String,
                description: 'The option you want to set.',
                required: true,
                choices: [
                    {
                        name: "User",
                        value: "user",
                        focused: true
                    },
                    {
                        name: "Guild",
                        value: "guild"
                    }
                ]
            },
            {
                name: 'id',
                type: ApplicationCommandOptionType.String,
                description: 'The ID of the user/guild you want to ban/unban.',
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
        const option = interaction.options.getString('option') ?? 'user';

        if (option === "guild") {
            const guildId = interaction.options.getString('id');
            let guild = await Guild.findOne({ id: guildId });

            if (!guild) {
                guild = new Guild({ id: guildId });
                await guild.save().catch(err => bot.logger.error(err));
            }

            await Guild.updateOne({ id: guildId }, { banned: !guild.banned });
            await interaction.reply({ content: `Guild ${guildId} has been ${!guild.banned ? "unbanned" : "banned"} from using Coinz.`, ephemeral: true });
        } else {
            await interaction.reply({ content: `You can't ban users in Coinz yet.`, ephemeral: true });
        }
    }
}