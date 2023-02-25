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
        .setName("ultron_seed_w_bug_fact")
        .setDescription("Ping Seeders with a random bug fact")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {

        const channelID = process.env.SEEDER_C //#seeder
        const roleID = process.env.SEEDER_R //@seeder
        const channel = interaction.guild.channels.cache.get(channelID)
        const role = interaction.guild.roles.cache.get(roleID)

        await interaction.deferReply();

        const fact_prompt = `Give me a random bug or insect fact`

        const fact = await openai.createCompletion({
            model: process.env.OPENAI_MODEL,
            prompt: fact_prompt,
            temperature: parseFloat(process.env.OPENAI_TEMPERATURE),
            max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS),
        });

        response_text = `${role} GOF1:` +
            fact.data.choices[0].text;

        await channel.send(`${response_text}`);
        await interaction.editReply({ content: "Ping successfully sent to seeder channel", ephemeral: true });
    }
}

