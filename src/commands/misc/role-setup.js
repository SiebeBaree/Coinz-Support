import Command from "../../structures/Command.js"
import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js"

export default class extends Command {
    info = {
        name: "role-setup",
        description: "Setup all roles.",
        options: [],
        category: "misc",
        extraFields: [],
        enabled: true,
        deferReply: false
    };

    constructor(...args) {
        super(...args);
    }

    async run(interaction) {
        const content = ":sparkles: **__Special Roles__**\n" +
            "> <@&939819940796575764> ➼ For people who actively contribute to Coinz in some way or another.\n" +
            "> <@&938732975070248991> ➼ Given to those that boost the server.\n" +
            "> <@&940920638112145418> ➼ Role exclusively for Coinz Premium users.\n\n" +
            ":lock: **__Staff Roles__**\n" +
            "> <@&939800772227522561> ➼ Given to all staff members that actively advertise for Coinz.\n" +
            "> <@&939800727574949909> ➼ Given to the designers for Coinz.\n" +
            "> <@&939802251822780446> ➼ Be part of the Coinz staff team.\n" +
            "> <@&939800674235990056> ➼ Given to the moderators of the Coinz Support Server.\n" +
            "> <@&939800692971929611> ➼ Given to the developers of Coinz.\n" +
            "> <@&939801563214532638> ➼ Access to all perms.\n\n" +
            ":bell: **__Self Roles__**\n" +
            "> **Add your own roles using the select menu below!**\n";

        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("roles")
                .setPlaceholder("No roles selected.")
                .setMinValues(0)
                .setMaxValues(3)
                .addOptions([
                    {
                        label: "Announcements",
                        description: "Get notifications about smaller general updates.",
                        value: `roles${bot.config.roleId.announcement}`,
                        emoji: "📢"
                    },
                    {
                        label: "Giveaways",
                        description: "Get pinged whenever a new giveaway drops.",
                        value: `roles${bot.config.roleId.giveaways}`,
                        emoji: "🎉"
                    },
                    {
                        label: "Coinz Updates",
                        description: "Get notifications about all Coinz updates.",
                        value: `roles${bot.config.roleId.coinzUpdates}`,
                        emoji: "<:coinz:987800268223709254>"
                    }
                ]),
        );

        await interaction.channel.send({ content: content, components: [row] });
        await interaction.reply({ content: `Successfully setup the roles module.`, ephemeral: true });
    }
}