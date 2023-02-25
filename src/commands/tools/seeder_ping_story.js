const {
    SlashCommandBuilder,
    PermissionFlagsBits,
} = require("discord.js");

const {
    Configuration,
    OpenAIApi
} = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ultron_seed_w_story")
        .setDescription("Ping Seeders with a Story about a Random Member")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        {

            const channelID = process.env.SEEDER_C //#seeder
            const roleID = process.env.SEEDER_R //@seeder
            const channel = interaction.guild.channels.cache.get(channelID)
            const role = interaction.guild.roles.cache.get(roleID)

            await interaction.deferReply();

            let garriRole = await interaction.guild.roles.fetch(process.env.GARRI_R)
            let members = await interaction.guild.members.fetch()
            let garris = members.filter(m => m._roles.includes(process.env.GARRI_R))

            garri = garris.get(Array.from(garris.keys())[Math.floor(Math.random() * garris.size)])

            const adjectives = ['mysterious', 'funny', 'random', 'weird',
                'adventurous', 'unexpected', 'inspiring', 'fantasy', 'sci-fi']
            index = Math.floor(Math.random() * adjectives.length)

            const story_prompt = `Tell me a ${adjectives[index]} story about a guy named ${garri.displayName}`

            const story = await openai.createCompletion({
                model: process.env.OPENAI_MODEL,
                prompt: story_prompt,
                temperature: parseFloat(process.env.OPENAI_TEMPERATURE),
                max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS),
            });

            response_text = `${role} Let me tell you a story about ${garri.displayName}...` +
                story.data.choices[0].text +
                "\n\nMoral of the Story: GOF1";

            await channel.send(response_text)
            await interaction.editReply({ content: "Ping successfully sent to seeder channel", ephemeral: true })
        }
    },
}

