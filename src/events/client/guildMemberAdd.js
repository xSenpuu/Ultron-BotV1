const { EmbedBuilder } = require('discord.js')
const MemberHelper = require("../../helpers/members")

module.exports = {
  name: "guildMemberAdd",
  async execute(interaction, client) {
    //console.log("hi")
    const channelID = process.env.WELCOME_C
    //console.log(interaction)
    $rand = Math.floor(Math.random() * 3);
    if ($rand == 0) {
      $text = `<@${interaction.user.id}>, How do you hope to stop me?`
    } else if ($rand == 1) {
      $text = `<@${interaction.user.id}>, You're unbearably naive..`
    } else if ($rand == 2) {
      $text = `Tony Stark..? oh it's just you <@${interaction.user.id}>`
    }

    const addembed = new EmbedBuilder()
      .setTitle(`Men of peace create engines of war...`)
      .setDescription(`Welcome to **${interaction.guild.name}**, check out <#801855926511861832>. We were voted friendliest team on reddit. Here you'll find garrisons, bad puns, and obsessed losers who play this c-tier game just like you. Hop in voice and play with us.. I'd say we don't bite but we are a bunch of cunts so uh, enjoy your stay. Oh and if you wanna play comp HLL head to <#918575240651624508> and hit that :eggplant: to become a prospect.`)
      .setColor(0x800080)
      .setImage(`https://media.discordapp.net/attachments/936543359974121542/1008407381409026069/GOF---3.gif`)
      //.setThumbnail(interaction.member.displayAvatarURL())
      //.setTimestamp(Date.now())
      //.setAuthor({
      //name: interaction.user.username,
      //iconURL: interaction.member.displayAvatarURL(),
      .setFooter({
        iconURL:
          "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/907a507d-e421-4e1c-a7f9-a27a30cabd66/df2hcd0-4292b6df-74b3-4eff-a649-3e4b319300c9.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzkwN2E1MDdkLWU0MjEtNGUxYy1hN2Y5LWEyN2EzMGNhYmQ2NlwvZGYyaGNkMC00MjkyYjZkZi03NGIzLTRlZmYtYTY0OS0zZTRiMzE5MzAwYzkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.9hE9xeqK_NrJDA02KEXxPUatldwFFQakkgpD0rSmIag",
        text: "Powered by Stark Industries"
      })

    const channel = interaction.guild.channels.cache.get(channelID)

    await MemberHelper.memberAddGuildMember(client, interaction.guild.id, interaction.user.id, interaction.displayName)

    //channel.send(`<@${interaction.user.id}>`)
    channel.send({ content: ($text), embeds: [addembed], ephemeral: false });
  },
};