const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { DateTime, Info } = require("luxon");

const FOOTER = "To exit type 'cancel'"
const WAIT_TIME = 40000


const CREATE_TIME_ZONE = "Enter your time zone's number"
const CREATE_TIME_ZONE_DESCRIPTION = "1 Eastern Time"
const CREATE_TIME_STRING = "When should the event start?"
const CREATE_TIME_DESCRIPTION = "> Friday at 9pm\n> Tomorrow at 18:00\n> Now\n> In 1 hour\n> YYYY-MM-DD 7:00 PM"


const ERROR_TIMEOUT = "__**ERROR**__: Took too long to respond";
const ERROR_UNSUPPORTED = "__**ERROR**__: Operation not yet supported";
const ERROR_INVALID = "__**ERROR**__: Invalid Response";
const ERROR_LOCKOUT = "__**ERROR**__: Too many failed attempts";
const ERROR_ATTENDEES = "__**ERROR**__: Invalid response, assuming None"
const ERROR_EST_ONLY = "__**ERROR**__: Only eastern time is currently supported"

function generateEmbed(title, description) {
	const embed = new EmbedBuilder()
	.setColor(0x00FF00)
	.setTitle(title)
	.setDescription(description)
	.setFooter({ text: FOOTER });

	return embed
}

function generateErrorEmbed(title) {
	const embed = new EmbedBuilder()
			.setColor(0xFF0000)
			.setTitle(title);
	return embed;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('time')
		.setDescription('Get local time conversion'),
	async execute(interaction, client) {
		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle("Begin time conversion")
			.setDescription("I've sent you a direct message with next steps");

            await interaction.reply({ ephemeral: true, embeds: [embed] });

			// await interaction.user.send({ embeds: [generateEmbed(CREATE_TIME_ZONE, CREATE_TIME_ZONE_DESCRIPTION)] });

			const filter = m => m.author.id === interaction.user.id;



			// Select Time Zone

			await interaction.user.send({ embeds: [generateEmbed(CREATE_TIME_ZONE, CREATE_TIME_ZONE_DESCRIPTION)] });
			
			let timeZoneCollected = await interaction.user.dmChannel.awaitMessages({filter, max: 1, time: WAIT_TIME });

			if (timeZoneCollected.size == 0) {
				await interaction.user.send({ embeds: [generateErrorEmbed(ERROR_TIMEOUT)] });
				return;
			} 

			let timeZoneResponse = timeZoneCollected.first().content
			// Need cancel
			if (timeZoneResponse != "1") {
				await interaction.user.send({ embeds: [generateErrorEmbed(ERROR_EST_ONLY)] });
			}

			// Enter Time String
			await interaction.user.send({ embeds: [generateEmbed(CREATE_TIME_STRING, CREATE_TIME_DESCRIPTION)] });
			let timeStringCollected = await interaction.user.dmChannel.awaitMessages({filter, max: 1, time: WAIT_TIME });

			if (timeStringCollected.size == 0) {
				await interaction.user.send({ embeds: [generateErrorEmbed(ERROR_TIMEOUT)] });
				return;
			} 

			let timeStringResponse = timeStringCollected.first().content

			let currentTime = DateTime.local().setZone("UTC-5")
			if (timeStringResponse.includes(" at ")) {
				let parts = timeStringResponse.split(" at ");
				console.log(parts)
				let enteredDayOfWeek = Info.weekdays("long").findIndex( e => e.toLowerCase().trim() == parts[0].toLowerCase().trim())
				let currentDay = currentTime.weekday - 1
				console.log(enteredDayOfWeek)
				console.log(currentDay)
				let dayDifference = (((enteredDayOfWeek - currentDay) % 7 ) + 7) % 7

				// console.log(Info.weekdays("long").findIndex( e => e.toLowerCase().trim() == parts[0].toLowerCase().trim()))
				console.log(Info.weekdays("long"))
				console.log(dayDifference)

				// Info.weekdays("long").forEach(e => )
				let eventTime = DateTime.local().setZone("UTC-5").plus({days: dayDifference})
				console.log(eventTime)
			}

			
			// console.log(timeStringResponse)
			// console.log(currentTime)
			// console.log(Info.weekdays("long")[currentTime.weekday])
			


		 
	},
};