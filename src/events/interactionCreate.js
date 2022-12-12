import Event from "../structures/Event.js"

const getRole = (guild, roleId) => {
    return guild.roles.cache.find(r => r.id === roleId);
}

const checkRole = async (interaction, roleId) => {
    const member = await interaction.guild.members.fetch(interaction.member.id).catch(console.error);
    return member.roles.cache.has(roleId);
}

const giveRole = async (interaction, roleId) => {
    let role = getRole(interaction.guild, roleId);
    await interaction.member.roles.add(role);
}

const takeRole = async (interaction, roleId) => {
    let role = getRole(interaction.guild, roleId);
    await interaction.member.roles.remove(role);
}

export default class extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(interaction) {
        if (!interaction.guild) return; // Return if dms or group chat
        if (interaction.member.bot) return; // Return if member is bot

        if (interaction.isCommand()) {
            const cmd = this.commands.get(interaction.commandName);
            if (!cmd) return;

            if (cmd.info.deferReply === true) await interaction.deferReply();
            await cmd.run(interaction);
        } else if (interaction.isStringSelectMenu()) {
            if (interaction.values.length > 0 && interaction.values[0].startsWith("roles")) {
                const roleIds = interaction.values.map((value) => value.replace('roles', ''));

                let rolesAdded = [];
                let rolesRemoved = [];

                for (let i = 0; i < roleIds.length; i++) {
                    if (await checkRole(interaction, roleIds[i])) {
                        await takeRole(interaction, roleIds[i]);
                        rolesRemoved.push(roleIds[i]);
                    } else {
                        await giveRole(interaction, roleIds[i]);
                        rolesAdded.push(roleIds[i]);
                    }
                }

                let content = "";
                if (rolesAdded.length > 0) content += `Added roles: ${rolesAdded.map((roleId) => `<@&${roleId}>`).join(", ")}`;
                if (rolesRemoved.length > 0) content += `\nRemoved roles: ${rolesRemoved.map((roleId) => `<@&${roleId}>`).join(", ")}`;

                await interaction.deferUpdate();
                await interaction.followUp({ content: content.length > 0 ? content : "No roles have been added.", ephemeral: true, target: interaction.user });
            } else if (interaction.values.length === 0) {
                await interaction.deferUpdate();
            }
        }
    }
}