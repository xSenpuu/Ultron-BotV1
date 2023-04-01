const { Guilds, EmbedBuilder } = require("discord.js");
const PROSPECT = process.env.PROSPECTS_R
const GARRI = process.env.GARRI_R
const TRAINING = process.env.TRAINING_C
const MATCH = process.env.MATCH_C

module.exports = {
    data: {
        name: `join-us`
    },
    async execute(interaction, client){
        if (interaction.isButton()) {
            const buttonID = interaction.customId;
            if (buttonID === 'join-us') { // get button by customId set below
                const member = interaction.member; // get member from the interaction - person who clicked the button
                const channelID = process.env.PROSPECTS_C //prospects
                const channel = interaction.guild.channels.cache.get(channelID)
                //console.log(member);
                const leftembed = new EmbedBuilder()
                .setTitle(`Prospect Notification`)
                .setDescription(`${member.displayName} just removed the <@&${PROSPECT}> role!`)
                .setColor(0x800080)
                .setFooter({
                iconURL:
                  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/907a507d-e421-4e1c-a7f9-a27a30cabd66/df2hcd0-4292b6df-74b3-4eff-a649-3e4b319300c9.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzkwN2E1MDdkLWU0MjEtNGUxYy1hN2Y5LWEyN2EzMGNhYmQ2NlwvZGYyaGNkMC00MjkyYjZkZi03NGIzLTRlZmYtYTY0OS0zZTRiMzE5MzAwYzkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.9hE9xeqK_NrJDA02KEXxPUatldwFFQakkgpD0rSmIag",
                text: "Powered by Stark Industries"
              })
              const prospectembed = new EmbedBuilder()
              .setTitle(`Prospect Notification`)
              .setDescription(`${member.displayName} just picked up the <@&${PROSPECT}> role!`)
              .setColor(0x800080)
              .setFooter({
              iconURL:
                "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/907a507d-e421-4e1c-a7f9-a27a30cabd66/df2hcd0-4292b6df-74b3-4eff-a649-3e4b319300c9.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzkwN2E1MDdkLWU0MjEtNGUxYy1hN2Y5LWEyN2EzMGNhYmQ2NlwvZGYyaGNkMC00MjkyYjZkZi03NGIzLTRlZmYtYTY0OS0zZTRiMzE5MzAwYzkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.9hE9xeqK_NrJDA02KEXxPUatldwFFQakkgpD0rSmIag",
              text: "Powered by Stark Industries"
            })  
                if (member.roles.cache.has(GARRI)){
                    await interaction.reply ({content: "You're already a Garri, fuck off.", ephemeral: true});
                    return;
                } //do nothing for garris
                if (member.roles.cache.has(PROSPECT)) { // if they already have the role
                    member.roles.remove(PROSPECT); // remove it
                    channel.send({embeds: [leftembed], ephemeral: false})
                    await interaction.reply ({content: 'You have been removed the Prospect role!', ephemeral: true})
                } else { // if they don't have the role
                    member.roles.add(PROSPECT); // add it
                    channel.send({embeds: [prospectembed], ephemeral: false})
                    await interaction.reply ({content: `You have acquired the <@&${PROSPECT}> role!
Welcome to the degenerate house, looking forward to watching you click some heads! 
All we ask is you hit buttons on <#${TRAINING}> & <#${MATCH}>!
We would also appreciate if you could help out with seeding if and when you can.`, ephemeral: true})
                }
            }
        }
    },
};
