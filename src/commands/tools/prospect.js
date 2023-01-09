const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("prospect")
    .setDescription("Display all Prospects")
    .addRoleOption((option) => option.setName('role').setDescription('The role to list').setRequired(true)),

  async execute(interaction) {
    //console.log(interaction.options.get('role').value)

    var x = interaction.guild.roles.cache.get(interaction.options.get('role').value).members.map(m=>m.user.id);
    x2 = "";
    console.log(x)
    for($i = 0; $i < x.length; $i++){
      console.log("!")
      x2 = x2 + x[$i]+"\n";
    }
    console.log(x2)

    const userembed = new EmbedBuilder()
      .setColor(0x800080)
      .setThumbnail(interaction.member.displayAvatarURL())
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.member.displayAvatarURL(),
      })
      .setFooter({
        iconURL:
          "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/907a507d-e421-4e1c-a7f9-a27a30cabd66/df2hcd0-4292b6df-74b3-4eff-a649-3e4b319300c9.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzkwN2E1MDdkLWU0MjEtNGUxYy1hN2Y5LWEyN2EzMGNhYmQ2NlwvZGYyaGNkMC00MjkyYjZkZi03NGIzLTRlZmYtYTY0OS0zZTRiMzE5MzAwYzkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.9hE9xeqK_NrJDA02KEXxPUatldwFFQakkgpD0rSmIag",
        text: "Powered by Stark Industries",
      })
      .addFields(
        {
          name: "Joined server on:",
          value: interaction.member.joinedAt.toDateString(),
          inline: true,
        },
        { name: "\u200B", value: "\u200B", inline: true },
        { name: "Roles on server:", value: x2, inline: true }
      );
    return interaction.reply({ embeds: [userembed], ephemeral: false });
  },
};
