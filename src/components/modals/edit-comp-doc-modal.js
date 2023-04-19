const { Client } = require("pg")
const CompInfo = require(`../../commands/tools/manage_comp_info`)
const { Sequelize } = require("sequelize")
const { UltronCompDoc, UltronGuild } = require("../../database/ultron_sequelize")
const CompDocHelper = require("../../helpers/comp-docs")
const GuildHelper = require("../../helpers/guilds")

const Op = Sequelize.Op

module.exports = {
    data: {
        name: `edit-comp-doc-modal`
    },
    async execute(interaction, client, extra) {

        docName = interaction.fields.getTextInputValue('docName')
        docDescription = interaction.fields.getTextInputValue('docDescription')



        console.log(`Executing modal response for ID: '${extra}' Name: '${docName}' Description '${docDescription}'` +
            ` Client_ID: '${client.id}', Guild_ID: '${interaction.guildId}'`)

        doc = await CompDocHelper.fetchCompDoc(client.id, interaction.guildId, extra)

        //Edit Existing Link
        if (doc) {
            action = 'Edited'

            doc.name = docName
            doc.description = docDescription

            await doc.save()
        } else {
            action = 'Created'
            ultronguild = await GuildHelper.fetchGuild(client, interaction.guildId)

            doc = await UltronCompDoc.create({
                name: docName,
                description: docDescription,
                UltronGuildId: ultronguild.id
            })

        }

        embed = await CompInfo.fetchEmbed(interaction, client, doc)
        await CompDocHelper.fetchCompDocs(client, null, true)
        await interaction.reply({
            content: `Document Successfully ${action}!`,
            embeds: [embed],
            ephemeral: CompInfo.isEphemeral()
        });

    }
}