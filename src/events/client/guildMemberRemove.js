const { EmbedBuilder } = require('discord.js')
const GARRI = process.env.GARRI_R

const MemberHelper = require('../../helpers/members')

module.exports = {
  name: "guildMemberRemove",
  async execute(interaction, client) {
    const channelID = process.env.ADMIN_C //admin chat

    const garriembed = new EmbedBuilder()
      .setTitle(`Just to let you know..`)
      .setDescription(`**${interaction.displayName}** has left the Server, they were one of ours...`)
      .setColor(0x800080)
      .setFooter({
        iconURL:
          "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/907a507d-e421-4e1c-a7f9-a27a30cabd66/df2hcd0-4292b6df-74b3-4eff-a649-3e4b319300c9.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzkwN2E1MDdkLWU0MjEtNGUxYy1hN2Y5LWEyN2EzMGNhYmQ2NlwvZGYyaGNkMC00MjkyYjZkZi03NGIzLTRlZmYtYTY0OS0zZTRiMzE5MzAwYzkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.9hE9xeqK_NrJDA02KEXxPUatldwFFQakkgpD0rSmIag",
        text: "Powered by Stark Industries"
      })

    const channel = interaction.guild.channels.cache.get(channelID)

    console.log(interaction)
    guildId = interaction.guild.id
    memberId = interaction.user.id

    console.log(`Guild ID: '${guildId}', Member ID: '${memberId}', Garri Role Id: '${GARRI}'`)

    if (await MemberHelper.memberHasRole(client, guildId, memberId, GARRI)) {
      await channel.send({ embeds: [garriembed], ephemeral: false })
    };

    await MemberHelper.memberRemoveGuildMember(client, guildId, memberId)
  },
};