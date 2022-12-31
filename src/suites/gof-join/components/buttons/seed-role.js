const { Guilds, EmbedBuilder } = require("discord.js");
const SEEDER = '960909157232414720'
module.exports = {
    data: {
        name: `seed-role`
    },
    async execute(interaction, client){
        if (interaction.isButton()) {
            const buttonID = interaction.customId;
            if (buttonID === 'seed-role') { // get button by customId set below
                const member = interaction.member; // get member from the interaction - person who clicked the button
                
                if (member.roles.cache.has(SEEDER)) { // if they already have the role
                    member.roles.remove(SEEDER); // remove it
                    await interaction.reply ({content: 'You left the seeder role!', ephemeral: true})

                } else { // if they don't have the role
                    member.roles.add(SEEDER); // add it
                    await interaction.reply ({content: 'You obtained the seeder role!', ephemeral: true})

                }
            }
        }
    },
};
