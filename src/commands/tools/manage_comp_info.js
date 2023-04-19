const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ModalBuilder,
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");

const { Client } = require("pg");
const { UltronCompDoc, UltronGuild } = require("../../database/ultron_sequelize");
const { Sequelize } = require("sequelize")
const ephemeral = true
const CompDocHelper = require("../../helpers/comp-docs")
const MemberHelper = require("../../helpers/members")
const PrivilegeHelper = require("../../helpers/privileges")
const Op = Sequelize.Op;

async function edit_link(interaction, client, docId) {
    //console.log(`Edit -> value: ${docId}`)

    docs = await CompDocHelper.fetchCompDocs(client, interaction.guildId)
    doc = docs.filter(fdoc => fdoc.id == docId)
    //console.log(doc)

    modal = await make_doc_modal(interaction, client, doc[0].name)

    await interaction.showModal(modal)
}

async function create_link(interaction, client, linkName) {
    //console.log(`Create -> value: ${linkName}`)

    existingDoc = await UltronCompDoc.findAll({
        include: UltronGuild, where: {
            name: linkName,
            '$UltronGuild.guildId$': interaction.guildId
        }
    })

    if (existingDoc.length > 0) {
        await interaction.reply({
            content: `A Doc with name '${existingDoc[0].name}' already exists, please pick a different name.`,
            ephemeral: ephemeral
        })
        return
    }

    modal = await make_doc_modal(interaction, client, linkName)

    await interaction.showModal(modal)
}

async function delete_link(interaction, client, docId) {
    //console.log(`Delete -> docId: ${docId}`)

    doc = await UltronCompDoc.findByPk(docId)
    await doc.destroy()
    await CompDocHelper.fetchCompDocs(client, null, true)

    await interaction.reply({ content: `Link '${doc.name}' successfully deleted.`, ephemeral: ephemeral })

}

async function addRestriction(interaction, client, docId, privId) {

    doc = await CompDocHelper.fetchCompDoc(client.id, interaction.guildId, docId)
    priv = await PrivilegeHelper.fetchPrivilege(client.id, interaction.guildId, privId)

    // console.log("Doc")
    // console.log(doc)

    // console.log("Priv")
    // console.log(priv)

    if ((!doc) || (!priv)) {
        await interaction.reply({ content: "Incorrect Doc or Privilege, please try again" })
        return
    }

    await doc.addUltronPrivilege(priv)
    await CompDocHelper.fetchCompDocs(client, null, true)
    await PrivilegeHelper.fetchPrivileges(client, null, true)

    // console.log("Post Doc")
    // console.log(doc)

    // console.log("Post Priv")
    // console.log(priv)

    await interaction.reply({
        content: `Successfully added Privilege '${priv.name}' as Restriction to Document '${doc.name}'.`,
        ephemeral: ephemeral
    })

}

async function removeRestriction(interaction, client, docId, privId) {
    doc = await CompDocHelper.fetchCompDoc(client.id, interaction.guildId, docId)
    priv = await PrivilegeHelper.fetchPrivilege(client.id, interaction.guildId, privId)

    // console.log("Doc")
    // console.log(doc)

    // console.log("Priv")
    // console.log(priv)

    if ((!doc) || (!priv)) {
        await interaction.reply({ content: "Incorrect Doc or Privilege, please try again" })
        return
    }

    await doc.removeUltronPrivilege(priv)
    await CompDocHelper.fetchCompDocs(client, null, true)
    await PrivilegeHelper.fetchPrivileges(client, null, true)

    // console.log("Post Doc")
    // console.log(doc)

    // console.log("Post Priv")
    // console.log(priv)

    await interaction.reply({
        content: `Successfully removed Privilege '${priv.name}' as Restriction from Document '${doc.name}'.`,
        ephemeral: ephemeral
    })
}

async function viewRestriction(interaction, client, docId) {
    doc = await CompDocHelper.fetchCompDoc(client.id, interaction.guildId, docId)
    if (!doc) {
        await interaction.reply({ content: "Incorrect Doc, please try again" })
        return
    }

    restrictions = await CompDocHelper.fetchCompDocPrivileges(client, interaction.guildId, docId)

    restrictions_list = []

    restrictions.forEach(restriction => {
        restrictions_list.push(`'${restriction.name}':(${restriction.id})`)
    })

    title = `Restriction for Doc '${doc.name}'`
    description = restrictions_list.join("\n")

    embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setFooter({
            iconURL: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/907a507d-e421-4e1c-a7f9-a27a30cabd66/df2hcd0-4292b6df-74b3-4eff-a649-3e4b319300c9.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzkwN2E1MDdkLWU0MjEtNGUxYy1hN2Y5LWEyN2EzMGNhYmQ2NlwvZGYyaGNkMC00MjkyYjZkZi03NGIzLTRlZmYtYTY0OS0zZTRiMzE5MzAwYzkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.9hE9xeqK_NrJDA02KEXxPUatldwFFQakkgpD0rSmIag",
            text: "Powered by Stark Industries",
        })

    await interaction.reply({ embeds: [embed], ephemeral: ephemeral })


}

async function make_embed(interaction, client, doc) {

    //console.log(`Fetching embed for Guild_ID: '${interaction.guildId}' ` +
    //    `Link_Name: '${doc.name}'`)

    docPrivs = await CompDocHelper.fetchCompDocPrivileges(client.id, interaction.guildId, doc.id)

    restrictions = `\nRestrictions: `
    entries = []


    if (docPrivs.length <= 0) {
        restrictions = (restrictions + ` None.`)
    } else {

        docPrivs.forEach(priv => {
            entries.push(`'${priv.name}'`)
        })

        restrictions = (restrictions + entries.join(", "))
    }

    embed = new EmbedBuilder()
        .setTitle(doc.name)
        .setDescription(doc.description)
        .setThumbnail(interaction.guild.iconURL())
        .setFooter({
            iconURL: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/907a507d-e421-4e1c-a7f9-a27a30cabd66/df2hcd0-4292b6df-74b3-4eff-a649-3e4b319300c9.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzkwN2E1MDdkLWU0MjEtNGUxYy1hN2Y5LWEyN2EzMGNhYmQ2NlwvZGYyaGNkMC00MjkyYjZkZi03NGIzLTRlZmYtYTY0OS0zZTRiMzE5MzAwYzkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.9hE9xeqK_NrJDA02KEXxPUatldwFFQakkgpD0rSmIag",
            text: ("Powered by Stark Industries" + restrictions),
        });

    return embed
}

async function make_doc_modal(interaction, client, docName) {

    customID = `edit-comp-doc-modal`
    guildID = interaction.guildId
    description = ''
    action = 'Create new'
    doc = null

    ultroncompdocs = await CompDocHelper.fetchCompDocs(client, guildId)

    docs = ultroncompdocs.filter(compdoc => compdoc.name == docName)

    if (docs.length == 1) {
        doc = docs[0]
        customID = customID + `:${doc.id}`
        description = doc.description
        action = 'Edit existing'
    }

    const modal = new ModalBuilder()
        .setCustomId(customID)
        .setTitle(`${action} Document`)

    const docNameInput = new TextInputBuilder()
        .setCustomId('docName')
        .setLabel('Doc Name')
        .setValue(docName)
        .setPlaceholder('Enter a name for this Document')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(64)

    const docDescriptionInput = new TextInputBuilder()
        .setCustomId('docDescription')
        .setLabel('Document Description')
        .setValue(description)
        .setPlaceholder(`Enter a description/value for this Doc`)
        .setStyle(TextInputStyle.Paragraph)
        .setMaxLength(1024)
        .setRequired(false)

    modal.addComponents(new ActionRowBuilder().addComponents(docNameInput));
    modal.addComponents(new ActionRowBuilder().addComponents(docDescriptionInput));

    return modal
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ultron_comp_info')
        .setDescription('Returns various links for comp info')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('manage')
                .setDescription('Manage a specific Document')
                .addStringOption(option =>
                    option.setName('edit')
                        .setDescription('Edit an existing link')
                        .setAutocomplete(true),
                )
                .addStringOption(option =>
                    option.setName('create')
                        .setDescription('Create a new link')
                )
                .addStringOption(option =>
                    option.setName('delete')
                        .setDescription('Delete an existing link')
                        .setAutocomplete(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('add_restriction')
                .setDescription('Add a Restriction to a Document')
                .addStringOption(option =>
                    option
                        .setName('doc')
                        .setDescription('Document to add a Restriction to')
                        .setAutocomplete(true)
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName('privilege')
                        .setDescription('Privilege to set as Restriction')
                        .setAutocomplete(true)
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove_restriction')
                .setDescription('Remove a Restriction from a Document')
                .addStringOption(option =>
                    option
                        .setName('doc')
                        .setDescription('Document to remove a Restriction from')
                        .setAutocomplete(true)
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName('privilege')
                        .setDescription('Privilege to remove as Restriction')
                        .setAutocomplete(true)
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('view_restrictions')
                .setDescription('View all Restriction for a Document')
                .addStringOption(option =>
                    option
                        .setName('doc')
                        .setDescription('Document to view Restrictions of')
                        .setAutocomplete(true)
                        .setRequired(true))
        )

    ,
    async autocomplete(interaction, client) {

        option = interaction.options.getFocused(true)

        filtered = null
        choices = []

        if (["doc", "edit", "delete",].includes(option.name)) {
            unfiltered = []
            docs = await CompDocHelper.fetchCompDocs(client, interaction.guildId)

            for (const doc of docs) {

                privs = await CompDocHelper.fetchCompDocPrivileges(client,
                    interaction.guildId, doc.id)

                if (privs.length <= 0) {
                    unfiltered.push(doc)
                    continue
                }

                if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    unfiltered.push(doc)
                    continue
                }

                for (const priv of privs) {
                    if (await MemberHelper.memberHasPrivilege(client, guildId, interaction.memberId, priv.id)) {
                        unfiltered.push(doc)
                    }
                }
            }

            filtered = unfiltered.filter(choice => choice.name.toLowerCase().includes(option.value.toLowerCase()))
            filtered.forEach(choice => {
                choices.push({ name: choice.name, value: choice.id.toString() })
            })
        }

        if (["privilege"].includes(option.name)) {
            unfiltered = await PrivilegeHelper.fetchPrivileges(client, interaction.guildId)
            filtered = unfiltered.filter(choice => choice.name.toLowerCase().includes(option.value.toLowerCase()))
            filtered.forEach(choice => {
                choices.push({ name: choice.name, value: choice.id.toString() })
            })
        }
        await interaction.respond(choices)
    },
    async execute(interaction, client) {

        subcommand = interaction.options.getSubcommand()
        options = interaction.options.data[0].options
        switch (subcommand) {

            case "add_restriction":
                if (!(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))) {
                    await interaction.reply({ content: "You do not have permission to use this command.", ephemeral: ephemeral })
                    return
                }
                options = interaction.options.data[0].options
                priv = options.filter(option => option.name == 'privilege')
                privId = priv[0].value
                doc = options.filter(option => option.name == 'doc')
                docId = doc[0].value

                await addRestriction(interaction, client, docId, privId)
                break

            case "remove_restriction":
                if (!(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))) {
                    await interaction.reply({ content: "You do not have permission to use this command.", ephemeral: ephemeral })
                    return
                }
                options = interaction.options.data[0].options
                priv = options.filter(option => option.name == 'privilege')
                privId = priv[0].value
                doc = options.filter(option => option.name == 'doc')
                docId = doc[0].value

                await removeRestriction(interaction, client, docId, privId)
                break

            case "view_restrictions":
                if (!(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))) {
                    await interaction.reply({ content: "You do not have permission to use this command.", ephemeral: ephemeral })
                    return
                }

                await viewRestriction(interaction, client, options[0].value)
                break

            case "manage":
                if (!(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))) {
                    await interaction.reply({ content: "You do not have permission to use this command.", ephemeral: ephemeral })
                }
                if (options.length > 1 || options.length <= 0) {
                    await interaction.reply({ content: "Please select one valid option!", ephemeral: ephemeral })
                    return
                }
                switch (options[0].name) {
                    case "edit":
                        await edit_link(interaction, client, options[0].value)
                        break
                    case "create":
                        await create_link(interaction, client, options[0].value)
                        break
                    case "delete":
                        await delete_link(interaction, client, options[0].value)
                        break
                }
        }
    },
    async fetchEmbed(interaction, client, doc) {
        return await make_embed(interaction, client, doc)
    },
    isEphemeral() {
        return ephemeral
    }
}