const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const GARRI = '758397862399836260'
const PROSPECT_ID = "960908800787882004"

module.exports = {
	data: new SlashCommandBuilder()
		.setName('prospects')
		.setDescription('Returns prospects'),
	async execute(interaction, client) {

		if (!interaction.member.roles.cache.has(GARRI)) {
			interaction.reply("no")
			return
		}

		let prospectRole = await interaction.guild.roles.fetch(PROSPECT_ID)
		let members = await interaction.guild.members.fetch()
		let prospects = members.filter(m => m._roles.includes(PROSPECT_ID))
		let pings = []
		let nicknames = []
		prospects.forEach(prospect => {
			pings.push(`<@${prospect.user.id}>`)

			let tempName = prospect.nickname
			if (!tempName) {
				tempName = prospect.user.username
			}
			nicknames.push(tempName)
		})

		const prospectEmbed = new EmbedBuilder()
		.setColor(prospectRole.color)
		.setTitle('Prospects')
		.addFields(
			{ name: 'Ping', value: pings.join("\n"), inline: true },
			{ name: 'Nickname', value: nicknames.join("\n"), inline: true }
		);
		
		await interaction.reply({ embeds: [prospectEmbed] }); 
	},
};
