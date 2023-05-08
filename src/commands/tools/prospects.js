const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const GARRI = process.env.GARRI_R
const PROSPECT_ID = process.env.PROSPECTS_R

module.exports = {
	data: new SlashCommandBuilder()
		.setName('prospects')
		.setDescription('Returns prospects'),
	async execute(interaction, client) {

		if (!interaction.member.roles.cache.has(GARRI)) {
			interaction.reply("You do not have permission to run this command...")
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
			{ name: 'Nickname', value: nicknames.join("\n"), inline: true })
			.setFooter({
				iconURL:
				  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/907a507d-e421-4e1c-a7f9-a27a30cabd66/df2hcd0-4292b6df-74b3-4eff-a649-3e4b319300c9.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzkwN2E1MDdkLWU0MjEtNGUxYy1hN2Y5LWEyN2EzMGNhYmQ2NlwvZGYyaGNkMC00MjkyYjZkZi03NGIzLTRlZmYtYTY0OS0zZTRiMzE5MzAwYzkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.9hE9xeqK_NrJDA02KEXxPUatldwFFQakkgpD0rSmIag",
				text: "Powered by Stark Industries",
			});
		
		await interaction.reply({ embeds: [prospectEmbed] }); 
	},
};
