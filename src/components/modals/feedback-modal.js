const { EmbedBuilder } = require('discord.js')

module.exports = {
    data: {
        name: `feedback-modal`
    },
    async execute(interaction, client){
        const channelID = process.env.FEEDBACK_C
        const channel = interaction.guild.channels.cache.get(channelID)
        const role1 = interaction.fields.getTextInputValue('role1')
        const role2 = interaction.fields.getTextInputValue('role2')
        const input = interaction.fields.getTextInputValue('input')
        const member = interaction.member;
        const feedEmbed = new EmbedBuilder()
        .setTitle(`GOF Feedback Form`)
        .setDescription(`Here is the feedback for ${member.displayName}`)
        .addFields(
          {
            "name": "Prefered Role #1",
            "value": role1,
            "inline": true
          },
          {
            "name": "ㅤ",
            "value": "ㅤ",
            "inline": true
          },
                          {
            "name": "Prefered Role #2",
            "value": role2,
            "inline": true
          },
          {
            "name": "Feedback:",
            "value": input,
            "inline": true
          },
        )
        .setColor(0x800080)
        .setThumbnail(interaction.guild.iconURL())
        .setFooter({
          iconURL:
            "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/907a507d-e421-4e1c-a7f9-a27a30cabd66/df2hcd0-4292b6df-74b3-4eff-a649-3e4b319300c9.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzkwN2E1MDdkLWU0MjEtNGUxYy1hN2Y5LWEyN2EzMGNhYmQ2NlwvZGYyaGNkMC00MjkyYjZkZi03NGIzLTRlZmYtYTY0OS0zZTRiMzE5MzAwYzkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.9hE9xeqK_NrJDA02KEXxPUatldwFFQakkgpD0rSmIag",
          text: "Powered by Stark Industries",
        });

    channel.send({ embeds: [feedEmbed], ephemeral: false });
    await interaction.reply ({content: 'Your feedback has been submitted, thank you!', ephemeral: true});
         }
    }