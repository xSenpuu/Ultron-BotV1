const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Join GOF embed")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const join = new ButtonBuilder()
      .setCustomId("join-us")
      .setLabel("Join GOF")
      .setStyle(ButtonStyle.Primary)
      .setEmoji('🍆');

      const seed = new ButtonBuilder()
      .setCustomId("seed-role")
      .setLabel("Seeder Role")
      .setStyle(ButtonStyle.Primary)
      .setEmoji('🌱');

    const joinusEmbed = new EmbedBuilder()
      .setTitle("♿ Join GOF Competitive HLL Team ♿")
      .setDescription(
        `We are an active team in the competitive HLL scene, with weekly training events and multiple matches per week.

        Here's our recruiting process:
        1️⃣ React 🍆 to this to get Recruit role
        2️⃣ Hop in our discord for some games
        3️⃣ ???
        4️⃣ We'll let you know after we get some games in with you.
        
        We're always recruiting. Players are usually asked to join the team after a playing with us for a few days in discord voice. It is as simple as joining our voice chat, don't be shy!
        
        If you want to receive pings for helping us seed the //GOF server, react 🌱.
        
        Questions? Contact <@185303412743602176>`
      )
      .setColor(0x800080)
      .setFooter({
        iconURL:
          "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/907a507d-e421-4e1c-a7f9-a27a30cabd66/df2hcd0-4292b6df-74b3-4eff-a649-3e4b319300c9.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzkwN2E1MDdkLWU0MjEtNGUxYy1hN2Y5LWEyN2EzMGNhYmQ2NlwvZGYyaGNkMC00MjkyYjZkZi03NGIzLTRlZmYtYTY0OS0zZTRiMzE5MzAwYzkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.9hE9xeqK_NrJDA02KEXxPUatldwFFQakkgpD0rSmIag",
        text: "Powered by Stark Industries",
      });
    await interaction.reply({ embeds: [joinusEmbed], ephemeral: false, components: [new ActionRowBuilder().addComponents(join, seed)]},
    );
  },
};
