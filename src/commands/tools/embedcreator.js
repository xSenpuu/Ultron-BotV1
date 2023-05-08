const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const GARRI = process.env.GARRI_R

module.exports = {
    data: new SlashCommandBuilder()
    .setName('embedcreator')
    .setDescription('This creates a custom Embed')
    .addStringOption(option => option.setName('title').setDescription('This is the title of the embed').setRequired(true))
    .addStringOption(option => option.setName('description').setDescription('This is the description of the embed').setRequired(true))
    .addStringOption(option => option.setName('image').setDescription('This is the image at the bottom of the embed').setRequired(false))
    .addStringOption(option => option.setName('thumbnail').setDescription('This is the thumbnail of the embed').setRequired(false))
    .addStringOption(option => option.setName('field-name').setDescription('This is the field name').setRequired(false))
    .addStringOption(option => option.setName('field-value').setDescription('This is the field value').setRequired(false))
    .addStringOption(option => option.setName('footer').setDescription('This is the footer of the embed').setRequired(false)),
    async execute (interaction){

        if (!interaction.member.roles.cache.has(GARRI)) {
			interaction.reply("You do not have permission to run this command...")
			return
		}

        const { options } = interaction;

        const title = options.getString('title');
        const description = options.getString('description');
        const image = options.getString('image');
        const thumbnail = options.getString('thumbnail');
        const fieldn = options.getString('field-name') || ' ';
        const fieldv = options.getString('field-value') || ' ';
        const footer = options.getString('footer') || ' ';

        if (image){
            if (!image.startsWith('http')) return await interaction.reply({ content: "You cannot make this your image, it needs to be a http address.", ephemeral: true})
        }

        if (thumbnail){
            if (!thumbnail.startsWith('http')) return await interaction.reply({ content: "You cannot make this your thumbnail, it needs to be a http addess.", ephemeral: true})
        }

        const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(0x800080)
        .setImage(image)
        .setThumbnail(thumbnail)
        .setTimestamp()
        .addFields({ name: `${fieldn}`, value: `${fieldv}`})
        .setFooter({ text: `${footer}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true})})

        await interaction.reply({ content: "Your embed has been created!", ephemeral: true});

        await interaction.channel.send({ embeds: [embed], ephemermal: false});
    }

}