const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const CONSTANTS = require("../../constants/constants")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event')
        .setDescription('Setup an event'),
    async execute(interaction, client) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(CONSTANTS.ACCEPT)
                    .setLabel("Accept")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(CONSTANTS.DECLINE)
                    .setLabel("Decline")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId(CONSTANTS.TENTATIVE)
                    .setLabel("Tentative")
                    .setStyle(ButtonStyle.Primary),
            );

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Some title')
            .setURL('https://discord.js.org')
            .setDescription('Some description here')
            .addFields(
                { name: 'Accept', value: 'Some value here\nhello', inline: true },
                { name: 'Decline', value: 'Some value here', inline: true },
                { name: 'Tentative', value: 'Some value here', inline: true },
            );

        await interaction.reply({ephemeral: false, embeds: [embed], components: [row] });

    },
};