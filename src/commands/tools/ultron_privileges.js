const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ModalBuilder,
    EmbedBuilder,
} = require("discord.js");

const { Client } = require("pg");

const RolesHelper = require("../../helpers/roles")
const PrivilegesHelper = require("../../helpers/privileges");

const ephemeral = true

async function makeModal(interaction, client, privName) {

    customId = `edit-privileges-modal`
    description = ''
    action = 'Create new'

    privs = await PrivilegesHelper.fetchPrivileges(client, interaction.guildId)

    priv = privs.filter(fpriv => fpriv.name == privName)

    if (priv.length > 0) {
        action = 'Edit Existing'
        priv = priv[0]
        description = priv.description
        customId = customId + `:${priv.id}`
    }

    console.log(`Creating modal for Name: '${privName}', ` +
        `Custom ID: '${customId}', ` +
        `Description: '${description}'`)

    const modal = new ModalBuilder()
        .setCustomId(customId)
        .setTitle(`${action} Privilege`)

    const privNameInput = new TextInputBuilder()
        .setCustomId('privName')
        .setLabel('Privilege Name')
        .setValue(`${privName}`)
        .setPlaceholder(`Enter a name for this Privilege`)
        .setStyle(TextInputStyle.Short)
        .setMaxLength(64)
        .setRequired(true)

    const privDescriptionInput = new TextInputBuilder()
        .setCustomId('privDescription')
        .setLabel('Privilege Description')
        .setValue(description)
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder(`Enter a description/value for this Link`)
        .setMaxLength(256)
        .setRequired(false)

    modal.addComponents(new ActionRowBuilder().addComponents(privNameInput));
    modal.addComponents(new ActionRowBuilder().addComponents(privDescriptionInput));

    return modal
}

async function makeEmbed(interaction, client, priv) {


    embed = new EmbedBuilder()
        .setTitle(priv.name)
        .setDescription(priv.description)
        .setFooter({
            iconURL: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/907a507d-e421-4e1c-a7f9-a27a30cabd66/df2hcd0-4292b6df-74b3-4eff-a649-3e4b319300c9.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzkwN2E1MDdkLWU0MjEtNGUxYy1hN2Y5LWEyN2EzMGNhYmQ2NlwvZGYyaGNkMC00MjkyYjZkZi03NGIzLTRlZmYtYTY0OS0zZTRiMzE5MzAwYzkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.9hE9xeqK_NrJDA02KEXxPUatldwFFQakkgpD0rSmIag",
            text: "Powered by Stark Industries",
        });

    return embed
}

async function createPrivilege(interaction, client, privName) {
    privs = await PrivilegesHelper.fetchPrivileges(client, interaction.guildId)

    priv = privs.filter(priv => priv.name == privName)

    if (priv.length > 0) {
        await interaction.reply({ content: `Privilege with name '${privName}' already exists, please pick a new name.` })
        return
    }

    modal = await makeModal(interaction, client, privName)

    await interaction.showModal(modal)

}

async function editPrivilege(interaction, client, privId) {
    privs = await PrivilegesHelper.fetchPrivileges(client, interaction.guildId)

    priv = privs.filter(fpriv => fpriv.id == privId)

    if (priv.length <= 0) {
        await interaction.reply({
            content: `${privId} is not a valid Privilege. Please select a valid Privilege`,
            ephemeral: ephemeral
        })
        return
    }

    privName = priv

    modal = await makeModal(interaction, client, priv[0].name)

    await interaction.showModal(modal)
}

async function viewPrivilege(interaction, client, privId) {
    privs = await PrivilegesHelper.fetchPrivileges(client, interaction.guildId)
    priv = privs.filter(fpriv => fpriv.id == privId)

    if (priv.length <= 0) {
        await interaction.reply({
            content: `${privId} is not a valid Privilege. Please select a valid Privilege`,
            ephemeral: ephemeral
        })
        return
    }

    embed = await makeEmbed(interaction, client, priv[0])

    await interaction.reply({ embeds: [embed], ephemeral: ephemeral })
}

async function deletePrivilege(interaction, client, privId) {
    privs = await PrivilegesHelper.fetchPrivileges(client, interaction.guildId)
    priv = privs.filter(fpriv => fpriv.id == privId)

    if (priv.length <= 0) {
        await interaction.reply({
            content: `${privId} is not a valid Privilege. Please select a valid Privilege`,
            ephemeral: ephemeral
        })
        return
    } else { priv = priv[0] }

    await priv.destroy()
    await PrivilegesHelper.fetchPrivileges(client, null, true)

    await interaction.reply(`Privilege '${priv.name}' successfully deleted.`)
}

async function grantPrivilege(interaction, client, privId, roleId) {

    console.log(`Granting Privilege '${privId}' to Role '${roleId}'`)

    privs = await PrivilegesHelper.fetchPrivileges(client, interaction.guildId)
    roles = await RolesHelper.fetchRoles(client, interaction.guildId)


    priv = privs.filter(fpriv => fpriv.id == privId)

    role = roles.filter(frole => frole.roleId == roleId)


    if (priv.length < 1 || role.length < 1) {
        await interaction.reply({ content: "Incorrect role or privilege provided, please try again." })
        return
    }

    role = role[0]
    priv = priv[0]

    await role.addUltronPrivilege(priv)
    await PrivilegesHelper.fetchPrivileges(client, null, true)
    await RolesHelper.fetchRoles(client, null, true)

    await interaction.reply({
        content: `Successfully Granted Privilege '${priv.name}' to Role '${role.name}'.`,
        ephemeral: ephemeral
    })


}

async function revokePrivilege(interaction, client, privId, roleId) {
    console.log(`Granting Privilege '${privId}' to Role '${roleId}'`)

    privs = await PrivilegesHelper.fetchPrivileges(client, interaction.guildId)
    roles = await RolesHelper.fetchRoles(client, interaction.guildId)

    priv = privs.filter(fpriv => fpriv.id == privId)

    role = roles.filter(frole => frole.roleId == roleId)

    if (priv.length < 1 || role.length < 1) {
        await interaction.reply({ content: "Incorrect role or privilege provided, please try again." })
        return
    }

    role = role[0]
    priv = priv[0]

    await role.removeUltronPrivilege(priv)
    await PrivilegesHelper.fetchPrivileges(client, null, true)
    await RolesHelper.fetchRoles(client, null, true)

    await interaction.reply({
        content: `Successfully Revoke Privilege '${priv.name}' from Role '${role.name}'.`,
        ephemeral: ephemeral
    })
}

async function viewMembership(interaction, client, optName, optVal) {

    title = ''
    entries = []

    if (optName == 'role') {
        roles = await RolesHelper.fetchRoles(client, interaction.guildId)
        role = roles.filter(frole => frole.roleId == optVal)

        if (role.length < 1) {
            await interaction.reply({ content: 'Invalid Role Id provided, please try again.' })
            return
        }

        role = role[0]

        privs = await role.getUltronPrivileges()
        title = `Privileges granted to Role '${role.name}'`
        privs.forEach(priv => {
            entries.push(`'${priv.name}':(${priv.id})`)
        })

    }
    if (optName == 'privilege') {
        privs = await PrivilegesHelper.fetchPrivileges(client, interaction.guildId)
        // console.log(optVal)
        // console.log(privs)

        priv = privs.filter(fpriv => fpriv.id == optVal)

        if (priv.length < 1) {
            await interaction.reply({ content: 'Invalid Privilege Id provided, please try again.' })
            return
        }

        priv = priv[0]

        roles = await priv.getUltronRoles()
        title = `Roles with Privilege '${priv.name}'`
        roles.forEach(role => {
            entries.push(`'${role.name}':(${role.roleId})`)
        })
    }

    if (entries.length > 0) {
        description = entries.join("\n")
    } else { description = 'None' }


    embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setFooter({
            iconURL: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/907a507d-e421-4e1c-a7f9-a27a30cabd66/df2hcd0-4292b6df-74b3-4eff-a649-3e4b319300c9.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzkwN2E1MDdkLWU0MjEtNGUxYy1hN2Y5LWEyN2EzMGNhYmQ2NlwvZGYyaGNkMC00MjkyYjZkZi03NGIzLTRlZmYtYTY0OS0zZTRiMzE5MzAwYzkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.9hE9xeqK_NrJDA02KEXxPUatldwFFQakkgpD0rSmIag",
            text: "Powered by Stark Industries",
        });

    await interaction.reply({ embeds: [embed], ephemeral: ephemeral })

}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ultron_privileges')
        .setDescription('Manage Ultron Privileges')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('grant')
                .setDescription('Grant a Privilege to a Role')
                .addStringOption(option =>
                    option
                        .setName('privilege')
                        .setDescription('Select Privilege to grant')
                        .setRequired(true)
                        .setAutocomplete(true))
                .addStringOption(option =>
                    option
                        .setName('role')
                        .setDescription('Select Role for Privilege')
                        .setRequired(true)
                        .setAutocomplete(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('revoke')
                .setDescription('Revoke a Privilege from a Role')
                .addStringOption(option =>
                    option
                        .setName('privilege')
                        .setDescription('Select Privilege to grant')
                        .setRequired(true)
                        .setAutocomplete(true))
                .addStringOption(option =>
                    option
                        .setName('role')
                        .setDescription('Select Role for Privilege')
                        .setRequired(true)
                        .setAutocomplete(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('view_membership')
                .setDescription('View memberships of either roles or privileges')
                .addStringOption(option =>
                    option
                        .setName('privilege')
                        .setDescription('View Privilege membership')
                        .setAutocomplete(true))
                .addStringOption(option =>
                    option
                        .setName('role')
                        .setDescription('View Role membership')
                        .setAutocomplete(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('manage')
                .setDescription('Manage a specific Privilege')
                .addStringOption(option =>
                    option
                        .setName('create')
                        .setDescription('Create a new Privilege'))
                .addStringOption(option =>
                    option
                        .setName('edit')
                        .setDescription('Edit an existing Privilege')
                        .setAutocomplete(true))
                .addStringOption(option =>
                    option
                        .setName('delete')
                        .setDescription('Delete an existing Privilege')
                        .setAutocomplete(true))
                .addStringOption(option =>
                    option
                        .setName('view')
                        .setDescription('View description of existing Privilege')
                        .setAutocomplete(true)))
    ,
    async autocomplete(interaction, client) {

        option = interaction.options.getFocused(true)

        filtered = null
        choices = []

        if (option.name == "role") {

            unfiltered = await RolesHelper.fetchRoles(client, interaction.guildId)
            filtered = unfiltered.filter(choice => choice.name.toLowerCase().includes(option.value.toLowerCase()))
            filtered.forEach(choice => {
                choices.push({ name: choice.name, value: choice.roleId.toString() })
            })
        }
        if (["privilege", "edit", "view", "delete"].includes(option.name)) {
            unfiltered = await PrivilegesHelper.fetchPrivileges(client, interaction.guildId)
            filtered = unfiltered.filter(choice => choice.name.toLowerCase().includes(option.value.toLowerCase()))
            filtered.forEach(choice => {
                choices.push({ name: choice.name, value: choice.id.toString() })
            })
        }
        await interaction.respond(choices)

    },
    async execute(interaction, client) {

        subcommand = interaction.options.getSubcommand()

        switch (subcommand) {
            case "grant":
                options = interaction.options.data[0].options
                priv = options.filter(option => option.name == 'privilege')
                privId = priv[0].value
                role = options.filter(option => option.name == 'role')
                roleId = role[0].value

                await grantPrivilege(interaction, client, privId, roleId)
                break
            case "revoke":
                options = interaction.options.data[0].options
                priv = options.filter(option => option.name == 'privilege')
                privId = priv[0].value
                role = options.filter(option => option.name == 'role')
                roleId = role[0].value

                await revokePrivilege(interaction, client, privId, roleId)
                break
                break
            case "view_membership":
                options = interaction.options.data[0].options
                if (options.length > 1 || options.length <= 0) {
                    await interaction.reply({ content: "Please select one valid option!", ephemeral: ephemeral })
                    return
                }

                await viewMembership(interaction, client, options[0].name, options[0].value)
                break
            case "manage":
                options = interaction.options.data[0].options
                if (options.length > 1 || options.length <= 0) {
                    await interaction.reply({ content: "Please select one valid option!", ephemeral: ephemeral })
                    return
                }
                switch (options[0].name) {
                    case "create":
                        await createPrivilege(interaction, client, options[0].value)
                        break
                    case "edit":
                        await editPrivilege(interaction, client, options[0].value)
                        break
                    case "delete":
                        await deletePrivilege(interaction, client, options[0].value)
                        break
                    case "view":
                        await viewPrivilege(interaction, client, options[0].value)
                        break
                }
                break
        }
    },

    fetchEphemeral() {
        return ephemeral
    },

    async fetchEmbed(interaction, client, privName) {
        return await makeEmbed(interaction, client, privName)
    }

}