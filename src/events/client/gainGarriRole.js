const { EmbedBuilder } = require('discord.js')
const MemberHelper = require('../../helpers/members')

module.exports = {
  name: `guildMemberUpdate`,
  async execute(oldMember, newMember, client) {

    const roleID = process.env.GARRI_R
    const channelID = process.env.ADMIN_C

    memberId = newMember.user.id
    guildId = newMember.guild.id

    console.log(`Member ID: '${memberId}', Guild ID: '${guildId}'`)

    roles = newMember.roles.cache

    roleKeys = Array.from(roles.keys())

    for (const role of roles) {

      roleId = role[0]

      hasRole = await MemberHelper.memberHasRole(client, guildId, memberId, roleId)
      if (!hasRole) {
        console.log(`member does not have role '${roleId}'`)



        if (await MemberHelper.memberAddRole(client, guildId, memberId, roleId)) {
          console.log(`Role '${roleId}' added succesfully`)
          if (roleId == roleID) {
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
        } else { console.log(`Role '${roleId}' NOT added successfully`) }
      }
    }

    //remove roles member does not have
    memberRoles = await MemberHelper.fetchMemberRoles(client, guildId, memberId)

    for (const memberRole of memberRoles) {

      roleId = memberRole.roleId

      if (!(roleKeys.includes(roleId))) {
        console.log(`Remove role '${roleId}'`)

        if (await MemberHelper.memberRemoveRole(client, guildId, memberId, roleId)) {
          console.log(`Role '${roleId}' removed successfully`)
        } else { console.log(`Role '${roleId}' NOT removed successfully`) }
      }
    }
  }
}
