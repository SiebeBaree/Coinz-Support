module.exports.checkRole = async (interaction, roleId) => {
    const member = await interaction.guild.members.fetch(interaction.member.id).catch(console.error);
    if (member.roles.cache.has(roleId)) return true;
    else return false;
};

module.exports.giveRole = async (interaction, roleId) => {
    let role = interaction.guild.roles.cache.find(r => r.id === roleId);
    interaction.member.roles.add(role);
};

module.exports.takeRole = async (interaction, roleId) => {
    let role = interaction.guild.roles.cache.find(r => r.id === roleId);
    interaction.member.roles.remove(role);
};