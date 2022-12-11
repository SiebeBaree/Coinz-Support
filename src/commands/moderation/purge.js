module.exports.execute = async (client, interaction, data) => {
    const amount = interaction.options.getInteger("amount") || 1;
    await interaction.deferReply();

    const messages = await interaction.channel.messages.fetch({ limit: amount + 1 });
    const filtered = messages.filter((msg) => Date.now() - msg.createdTimestamp < 1209600000);
    await interaction.channel.bulkDelete(filtered);

    await interaction.editReply({ content: `Deleted ${filtered.size - 1} in <#${interaction.channel.id}>.` });
    await client.tools.sendLog(client, interaction.guild, "Purge", interaction.member.id, `**Messages Deleted:** ${filtered.size - 1}\n**Channel:** <#${interaction.channel.id}>`);
}

module.exports.help = {
    name: "purge",
    description: "Bulk delete messages in the channel.",
    options: [
        {
            name: 'amount',
            type: 'INTEGER',
            description: 'The amount you want to get rid off.',
            required: true,
            min_value: 1,
            max_value: 150
        }
    ],
    enabled: true,
    memberPermissions: ["MANAGE_MESSAGES"],
    ownerOnly: false
}
