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
      .setName("feedback")
      .setDescription("Please fill out the feedback form"),

    async execute(interaction, client) {

        const { roles } = interaction.member

        if (roles.cache.has(process.env.PROSPECTS_R)) {
            await interaction.reply({
                content: "You are not allowed to use this command, sorry...",
                ephemeral: true
            });

            return
            }
      const modal = new ModalBuilder()
      .setCustomId(`feedback-modal`)
      .setTitle(`Feedback`);
  
      const role1 = new TextInputBuilder()
          .setCustomId('role1')
          .setLabel(`What's your preferred role?`)
          .setRequired(true)
          .setStyle(TextInputStyle.Short)
          .setPlaceholder("Preferred Role")
          
      const role2 = new TextInputBuilder()
          .setCustomId('role2')
          .setLabel(`What's your prefered secondary role?`)
          .setRequired(true)
          .setStyle(TextInputStyle.Short)
          .setPlaceholder("Preferred Secondary Role");

        const input = new TextInputBuilder()
          .setCustomId('input')
          .setLabel(`Any feedback for us Papa's?`)
          .setRequired(true)
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder("Any feedback is appreciated");
  
          const firstactionrow = new ActionRowBuilder().addComponents(role1)
          const secondactionrow = new ActionRowBuilder().addComponents(role2)
          const thirdactionrow = new ActionRowBuilder().addComponents(input)
  
          modal.addComponents(firstactionrow, secondactionrow, thirdactionrow);
  
          await interaction.showModal(modal);
    },
  };