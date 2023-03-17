const { Guilds, EmbedBuilder } = require("discord.js");
const SEEDER_R = process.env.SEEDER_R
module.exports = {
    data: {
        name: `seed-role`
    },
    async execute(interaction, client){
        if (interaction.isButton()) {
            const buttonID = interaction.customId;
            if (buttonID === 'seed-role') { // get button by customId set below
                const member = interaction.member; // get member from the interaction - person who clicked the button
                
                if (member.roles.cache.has(SEEDER_R)) { // if they already have the role
                    member.roles.remove(SEEDER_R); // remove it
                    await interaction.reply ({content: `I have removed the <@&${SEEDER_R}> role!`, ephemeral: true})

                } else { // if they don't have the role
                    member.roles.add(SEEDER_R); // add it
                    await interaction.reply ({content: `You have obtained the <@&${SEEDER_R}> role!
                    
**Seeding**

__How to seed the server?__ Seeding is a numbers game. We need enough people in the server that we are the top not full server. People just want to get in and play so they join the first not full server they can get in. 
This means that even if we have 10 people in the server, and there are 2 ahead of us with 20 they will likely seed first, unless the players get bored and leave.

__How can you help?__ If you can, put your account in the server around <t:1679065200:t> afk is fine. It also helps to have active players. This means building garris, playing with them, ect... 
Another thing to consider is that if you are a better shooter than these people, please don't bully them and give them no chance or they will leave. We generally AFK until we see that we are on top or near the top on BM then we will play to retain the players`, ephemeral: true})

                }
            }
        }
    },
};
