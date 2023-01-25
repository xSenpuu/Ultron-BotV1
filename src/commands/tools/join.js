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
    const channelID = '918575240651624508' //#join-gof
    const channel = interaction.guild.channels.cache.get(channelID)
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
      .setTitle("♿ Join GOF Hell Let Loose Competitive Team ♿")
      .setDescription(
        `We are an active team in the competitive HLL scene, with weekly training events and multiple matches per week, which are available even to Prospects.

        Here's our recruitment process:
        1️⃣ Press the Join GOF 🍆 button below to get Prospecc role.
        2️⃣ You will be DM'd by our Recruiters.
        3️⃣ Jump into games with the members & get on voice.
        4️⃣ We'll let you know after we get some games in with you.
        
        We're always recruiting. Players are usually asked to join the team after a playing with us for a few days in discord voice. It is as simple as joining our voice chat, don't be shy! Even if Competitive isn't for you, we have non competitive members also to play public matches with and seed the server!
        
        **If you want to receive pings for helping us seed the //GOF server, react with the seeder role below 🌱.**
        
        Do you have any Questions? Contact <@677859171130933305> regarding Recruitment.`
      )
      .setColor(0x800080)
      .setFooter({
        iconURL:
          "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/907a507d-e421-4e1c-a7f9-a27a30cabd66/df2hcd0-4292b6df-74b3-4eff-a649-3e4b319300c9.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzkwN2E1MDdkLWU0MjEtNGUxYy1hN2Y5LWEyN2EzMGNhYmQ2NlwvZGYyaGNkMC00MjkyYjZkZi03NGIzLTRlZmYtYTY0OS0zZTRiMzE5MzAwYzkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.9hE9xeqK_NrJDA02KEXxPUatldwFFQakkgpD0rSmIag",
        text: "Powered by Stark Industries",
      });

    await channel.send ({ embeds: [joinusEmbed], ephemeral: false, components: [new ActionRowBuilder().addComponents(join, seed)]});
    await interaction.reply ({content: '*Embed has been sent*', ephemeral: true});
  }
}
