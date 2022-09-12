const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MAX_TRIES = 3
const WAIT_TIME = 40000

const FOOTER = "To exit type 'cancel'"
const CREATE_TITLE = "Enter the event title";
const CREATE_TITLE_DESCRIPTION = "Up to 200 characters are permitted";
const CREATE_DESCRIPTION = "Enter event description"
const CREATE_DESCRIPTION_DESCRIPTION = "Type `None` for no description. Up to 1600 characters are permitted."
const CREATE_SIGNUP = "Signup options"
const CREATE_SIGNUP_DESCRIPTION = "By default, users can sunup as **Accepted**, **Declined**, or **Tentative**\n\n**1** Keep the defaults\n**2** Configure signup options\n**3** Us a signup preset\n\nEnter a number to select an option"
const CREATE_ATTENDEES = "Enter the maximum number of attendees"
const CREATE_ATTENDEES_DESCRIPTION = "Type `None` for no limit. Up to 250 attendees are permitted"


const CANCEL = "Cancel"

const ERROR_TIMEOUT = "__**ERROR**__: Took too long to respond";
const ERROR_UNSUPPORTED = "__**ERROR**__: Operation not yet supported";
const ERROR_INVALID = "__**ERROR**__: Invalid Response";
const ERROR_LOCKOUT = "__**ERROR**__: Too many failed attempts";



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

function handleError(interaction, title) {
	const embed = generateErrorEmbed(title);
	interaction.user.send({ embeds: [embed] });
}

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

			let channelName = interaction.channel.name
			console.log(channelName)

			const embed2 = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle("Where would you like to post this event?")
			.setDescription(`**1** in current channel <#${interaction.channel.id}> \n **2** in another channel`)
			.setFooter({ text: "Enter a number to select an option \n to exit type 'cancel'" });

			const filter = m => m.author.id === interaction.user.id;

			// Title

            await interaction.user.send({ embeds: [generateEmbed(CREATE_TITLE, CREATE_TITLE_DESCRIPTION)] });

			let eventTitleCollection = await interaction.user.dmChannel.awaitMessages({filter, max: 1, time: WAIT_TIME });

			if (eventTitleCollection.size == 0) {
				await interaction.user.send({ embeds: [generateErrorEmbed(ERROR_TIMEOUT)] });
				return;
			} 
		
			let title = eventTitleCollection.first().content.substring(0,200);

			if (title.toLowerCase() == "cancel") {
				await interaction.user.send({ embeds: [generateErrorEmbed(CANCEL)] });
				return;
			}


			// Description

			await interaction.user.send({ embeds: [generateEmbed(CREATE_DESCRIPTION, CREATE_DESCRIPTION_DESCRIPTION)] });

			let eventDescriptionCollection = await interaction.user.dmChannel.awaitMessages({filter, max: 1, time: WAIT_TIME });

			if (eventDescriptionCollection.size == 0) {
				await interaction.user.send({ embeds: [generateErrorEmbed(ERROR_TIMEOUT)] });
				return;
			} 

			let description = eventDescriptionCollection.first().content.substring(0,1600);

			
			if (description.toLowerCase() == "cancel") {
				await interaction.user.send({ embeds: [generateErrorEmbed(CANCEL)] });
				return;
			}

			if (description.toLowerCase() == "none") {
				description = "";
			}

			// Signup Options

			await interaction.user.send({ embeds: [generateEmbed(CREATE_SIGNUP, CREATE_SIGNUP_DESCRIPTION)] });
			
			let needResponse = true;
			let attempts = 0;
			let response = 0;
			while (needResponse && attempts < MAX_TRIES) {
				let collected = await interaction.user.dmChannel.awaitMessages({filter, max: 1, time: 40000 });
				let response = collected.first().content
				console.log(response)

				if (response == "1") {
					needResponse = false

				} else if (response === "2") {
					handleError(interaction, ERROR_UNSUPPORTED);
					await interaction.user.send({ embeds: [generateEmbed(CREATE_SIGNUP, CREATE_SIGNUP_DESCRIPTION)] });
				}else if (response == "3") {
					handleError(interaction, ERROR_UNSUPPORTED);
					await interaction.user.send({ embeds: [generateEmbed(CREATE_SIGNUP, CREATE_SIGNUP_DESCRIPTION)] });
				} else {
					handleError(interaction, ERROR_INVALID);
					await interaction.user.send({ embeds: [generateEmbed(CREATE_SIGNUP, CREATE_SIGNUP_DESCRIPTION)] });
				}
				attempts++
			}

			
			if (needResponse) {
				handleError(interaction, ERROR_LOCKOUT);
				return
			} 

			console.log(response)

			// Attendees

			await interaction.user.send({ embeds: [generateEmbed(CREATE_ATTENDEES, CREATE_ATTENDEES_DESCRIPTION)] });

			needResponse = true;
			attempts = 0;
			response = 0;
			while (needResponse && attempts < MAX_TRIES) {
				let collected = await interaction.user.dmChannel.awaitMessages({filter, max: 1, time: 40000 });
				let response = collected.first().content
				console.log(response)

				if (response == "1") {
					needResponse = false

				} else if (response === "2") {
					handleError(interaction, ERROR_UNSUPPORTED);
					await interaction.user.send({ embeds: [generateEmbed(CREATE_SIGNUP, CREATE_SIGNUP_DESCRIPTION)] });
				}else if (response == "3") {
					handleError(interaction, ERROR_UNSUPPORTED);
					await interaction.user.send({ embeds: [generateEmbed(CREATE_SIGNUP, CREATE_SIGNUP_DESCRIPTION)] });
				} else {
					handleError(interaction, ERROR_INVALID);
					await interaction.user.send({ embeds: [generateEmbed(CREATE_SIGNUP, CREATE_SIGNUP_DESCRIPTION)] });
				}
				attempts++
			}

			
			if (needResponse) {
				handleError(interaction, ERROR_LOCKOUT);
				return
			} 
			





			// let needResponse = true;
			// let attempts = 0;

			// while (needResponse && attempts < MAX_TRIES) {
			// 	let collected = await interaction.user.dmChannel.awaitMessages({ max: 1, time: 40000 });
			// 	let message = collected.first().content
			// 	console.log(message)

			// 	if (message == "1") {
			// 		needResponse = false

			// 	} else if (message === "2") {
			// 		handleError(interaction, "**ERROR**: Operation not yet supported")
			// 	} else {
			// 		await interaction.user.send("Error: Invalid Response");
			// 	}
			// 	attempts++
			// }

			// if (needResponse) {
			// 	await interaction.user.send("Error: You fucked up");
			// } else {
			// 	await interaction.user.send("Good Job");
			// }



            // console.log(message.content)          
	},
};