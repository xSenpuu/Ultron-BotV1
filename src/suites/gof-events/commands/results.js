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

    const textInput = new TextInputBuilder()
        .setCustomId('results')
        .setLabel('What was the match result?')
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Enter the Match Result here")

        modal.addComponents(new ActionRowBuilder().addComponents(textInput));

        await interaction.showModal(modal);
  },
};
