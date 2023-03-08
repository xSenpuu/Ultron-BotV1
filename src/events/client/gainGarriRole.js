const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: `guildMemberUpdate`,
  async execute(oldMember, newMember, client) {

    return

    const roleID = process.env.GARRI_R
    const channelID = process.env.ADMIN_C

    console.log(oldMember.roles)
    console.log(newMember.roles)

    if (oldMember.roles.find(r => r.id === roleID)) return;
    if (newMember.roles.find(r => r.id === roleID)) {

      const addembed = new EmbedBuilder()
        .setTitle(`Garri Role Granted`)
        .setDescription(`<@${newMember.id}> just gained the <@&${roleID}> role.`)
        .setColor(0x800080)
        .setFooter({
          iconURL:
            "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/907a507d-e421-4e1c-a7f9-a27a30cabd66/df2hcd0-4292b6df-74b3-4eff-a649-3e4b319300c9.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzkwN2E1MDdkLWU0MjEtNGUxYy1hN2Y5LWEyN2EzMGNhYmQ2NlwvZGYyaGNkMC00MjkyYjZkZi03NGIzLTRlZmYtYTY0OS0zZTRiMzE5MzAwYzkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.9hE9xeqK_NrJDA02KEXxPUatldwFFQakkgpD0rSmIag",
          text: "Powered by Stark Industries"
        })

      const channel = newMember.guild.channels.cache.get(channelID)

      //channel.send(`<@${interaction.user.id}>`)
      channel.send({ content: null, embeds: [addembed], ephemeral: false })

    }
  },
};