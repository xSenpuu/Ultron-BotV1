const { Guilds, EmbedBuilder } = require("discord.js");
const PAPA_R = process.env.PAPA_R

module.exports = {
    data: {
        name: `patreon`
    },
    async execute(interaction, client){
        if (interaction.isButton()) {
            const buttonID = interaction.customId;
            if (buttonID === 'patreon') { // get button by customId set below
                const member = interaction.member; // get member from the interaction - person who clicked the button

                const patreonEmbed = new EmbedBuilder()
                .setTitle(`GOF Patreon`)
                .setDescription(`                    
                Hi ${member.displayName}. You know how this shitty game HLL seems to have limited servers and getting in queue sucks? Well GOF server has been thicc lately and fully seeded throughout the day, so you can bypass that now, just like you did in NPA making Chuck roll in some extra loot. We can't promise we won't spend it on hookers and blow, but do thank you for your support.
                
                https://www.patreon.com/gof
                
                **Standard VIP | $5 per month**
                VIP Access to GOF 1 // US EAST
                
                Once purchased, message a <@&${PAPA_R}> 👴 to get your VIP`)
                .setImage('https://i.imgur.com/W4mlM4k.jpg')
                .setColor(0x800080)
                .setFooter({
                iconURL:
                  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/907a507d-e421-4e1c-a7f9-a27a30cabd66/df2hcd0-4292b6df-74b3-4eff-a649-3e4b319300c9.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzkwN2E1MDdkLWU0MjEtNGUxYy1hN2Y5LWEyN2EzMGNhYmQ2NlwvZGYyaGNkMC00MjkyYjZkZi03NGIzLTRlZmYtYTY0OS0zZTRiMzE5MzAwYzkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.9hE9xeqK_NrJDA02KEXxPUatldwFFQakkgpD0rSmIag",
                text: "Powered by Stark Industries"
              })
                
                    await interaction.reply ({ embeds:[patreonEmbed], ephemeral: true})

                }
            }
        }
    };