
const PrivilegesHelper = require("../../helpers/privileges")
const GuildHelper = require("../../helpers/guilds")
const UltronPrivileges = require("../../commands/tools/ultron_privileges")
const { UltronPrivilege } = require("../../database/ultron_sequelize")

module.exports = {
    data: {
        name: `edit-privileges-modal`
    },
    async execute(interaction, client, extra) {

        privs = await PrivilegesHelper.fetchPrivileges(client, interaction.guildId)

        priv = privs.filter(fpriv => fpriv.id == extra)
        privName = interaction.fields.getTextInputValue('privName')
        privDescription = interaction.fields.getTextInputValue('privDescription')

        if (priv.length > 0) {
            action = 'Edited'
            priv = priv[0]
            priv.name = privName
            priv.description = privDescription
            await priv.save()

        } else {
            action = 'Created'

            ultronguilds = await GuildHelper.fetchGuilds(client, interaction.guildId)
            ultronguild = ultronguilds[0]

            priv = await UltronPrivilege.create({ name: privName, description: privDescription, UltronGuildId: ultronguild.id })
        }

        await PrivilegesHelper.fetchPrivileges(client, null, true)
        embed = await UltronPrivileges.fetchEmbed(interaction, client, priv)

        await interaction.reply({
            content: `Privilege ${action} successfully`,
            embeds: [embed],
            ephemeral: UltronPrivileges.fetchEphemeral()
        })
    }
}
