const {
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("results")
    .setDescription("Posts the Match Results")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {

    const modal = new ModalBuilder()
      .setCustomId(`results-modal`)
      .setTitle(`Match Result`);

    const team = new TextInputBuilder()
      .setCustomId('team')
      .setLabel('Who was the match against?')
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Who was the match against?")

    const input = new TextInputBuilder()
      .setCustomId('input')
      .setLabel('Enter the Match Result here!')
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("Enter the Match Result here!");

    const firstactionrow = new ActionRowBuilder().addComponents(team)
    const secondactionrow = new ActionRowBuilder().addComponents(input)

    modal.addComponents(firstactionrow, secondactionrow);

    await interaction.showModal(modal);
  },
};
