const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('event')
		.setDescription('Setup an event'),
	async execute(interaction, client) {
		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle("Let's create an event!")
			.setDescription("I've sent you a direct message with next steps");

            await interaction.reply({ ephemeral: true, embeds: [embed] });

            await interaction.user.send({ embeds: [embed] });

            let collected = await interaction.user.dmChannel.awaitMessages({ max: 1, time: 40000 });
            let message = collected.first()

            console.log(message.content)          
	},
};