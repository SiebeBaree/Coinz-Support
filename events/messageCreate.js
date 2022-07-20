const { MessageEmbed } = require('discord.js');
const modmailSchema = require('../database/schemas/modmail');

const logChannelId = "939870751744462868";

const createChannelName = (user) => {
    let username = user.username.toLowerCase().replace(/[^A-Za-z0-9 ]/g, '');
    username = username.toLowerCase().replace(/\s+/g, '-').trim();
    return `${username}-${user.discriminator}`;
}

const checkChannel = (guild, user) => {
    return guild.channels.cache.find(channel => channel.name === createChannelName(user));
}

const createChannel = async (client, guild, user) => {
    return await guild.channels.create(createChannelName(user), {
        type: "GUILD_TEXT",
        permissionOverwrites: [
            {
                id: guild.roles.everyone,
                allow: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES', 'EMBED_LINKS', 'ADD_REACTIONS', 'USE_EXTERNAL_EMOJIS'],
                deny: ['VIEW_CHANNEL']
            },
            {
                id: client.config.ticket.adminRoleId,
                allow: ['VIEW_CHANNEL']
            }
        ],
        parent: client.config.ticket.categoryId
    });
}

module.exports = async (client, message) => {
    if (message.author.bot) return;

    if (message.guild === null) {
        const guild = client.guilds.cache.get(client.config.serverId);

        if (await guild.members.fetch(message.author)) {
            let createdModmail = false;

            let channel = checkChannel(guild, message.author);
            if (channel === undefined) {
                channel = await createChannel(client, guild, message.author);
                createdModmail = true;
            }

            let obj = await modmailSchema.findOne({ userId: message.author.id, channelId: channel.id });
            if (!obj) {
                obj = new modmailSchema({
                    userId: message.author.id,
                    channelId: channel.id
                });
                await obj.save().catch(err => console.log(err));
                createdModmail = true;
            }

            if (createdModmail) {
                try {
                    const embedAuthor = new MessageEmbed()
                        .setAuthor({ name: `${message.author.username}#${message.author.discriminator}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setColor(client.config.embedColor)
                        .setDescription("A private channel between you and Coinz staff has been created.")
                        .setFooter({ text: client.config.footer })

                    await message.author.send({ embeds: [embedAuthor] });
                } catch { }

                const logsChannel = guild.channels.cache.get(logChannelId);
                if (logChannelId !== null) {
                    const embedLogs = new MessageEmbed()
                        .setAuthor({ name: `${message.author.username}#${message.author.discriminator}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setColor(client.config.embedColor)
                        .setDescription(`Modmail channel created. <#${channel.id}>`)
                        .setFooter({ text: client.config.footer })
                        .setTimestamp()

                    await logsChannel.send({ embeds: [embedLogs] });
                }
            }

            const embedChannel = new MessageEmbed()
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setColor("#303136")
                .setDescription(message.content)

            await channel.send({ embeds: [embedChannel] });
        } else {
            try {
                const embed = new MessageEmbed()
                    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setColor(client.config.embedColor)
                    .setDescription("You are not in the Coinz Support server. Please join the server first!\n\n**Invite Link:** https://discord.gg/asnZQwc6kW\n\n*If this is a mistake, please message Siebe#9999 (<@643072638075273248>)*")
                    .setFooter({ text: client.config.footer })

                await message.author.send({ embeds: [embed] });
            } catch { }
        }
    } else {
        let obj = await modmailSchema.findOne({ channelId: message.channelId });

        if (obj) {
            if (message.content === "close") {
                let channel = message.guild.channels.cache.get(message.channelId);
                if (channel !== null) await channel.delete("Closed modmail channel.");
                await modmailSchema.deleteOne({ channelId: channel.id });

                const logsChannel = message.guild.channels.cache.get(logChannelId);
                if (logChannelId !== null) {
                    const embedLogs = new MessageEmbed()
                        .setTitle(`Closed Modmail channel`)
                        .setColor(client.config.embedColor)
                        .setDescription(`Closed modmail channel (${channel.name})`)
                        .setFooter({ text: client.config.footer })
                        .setTimestamp()

                    await logsChannel.send({ embeds: [embedLogs] });
                }

                try {
                    const user = await message.guild.members.fetch(obj.userId);

                    const embed = new MessageEmbed()
                        .setTitle(`Closed Ticket`)
                        .setColor(client.config.embedColor)
                        .setDescription(`Your ticket has been closed. Please send another message to open a new ticket.`)
                        .setFooter({ text: client.config.footer })
                        .setTimestamp()

                    await user.send({ embeds: [embed] });
                } catch (e) {
                    await message.channel.send({ content: `I couldn't send the close message. The user doesn't know this modmail session is closed.` });
                }

                return;
            }

            const user = await message.guild.members.fetch(obj.userId);

            if (user === null || user === undefined) {
                await message.channel.send({ content: `I couldn't find the user linked to this channel.` });
            } else {
                try {
                    const embed = new MessageEmbed()
                        .setAuthor({ name: `${message.author.username}#${message.author.discriminator}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setColor("#303136")
                        .setDescription(message.content)

                    await user.send({ embeds: [embed] });
                } catch (e) {
                    await message.channel.send({ content: `I couldn't send the message to the user.` });
                }
            }
        }
    }
}