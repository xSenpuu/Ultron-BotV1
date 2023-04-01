const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");

const { UltronCompDoc } = require("../../database/ultron_sequelize");
const { Sequelize } = require("sequelize")
const ephemeral = true
const CompDocHelper = require("../../helpers/comp-docs")
const MemberHelper = require("../../helpers/members")
const PrivilegeHelper = require("../../helpers/privileges")
const Op = Sequelize.Op;

async function view_link(interaction, client, docId) {
    //console.log(`View -> docId: ${docId}`)

    try {
        doc = await UltronCompDoc.findByPk(docId)
    } catch (e) {
        await interaction.reply({ content: `Invalid Document Name provided, please try again.`, ephemeral: ephemeral })
        return
    }
    await interaction.reply({ embeds: [await make_embed(interaction, client, doc)], ephemeral: ephemeral })
}

async function make_embed(interaction, client, doc) {

    console.log(`Fetching embed for Guild_ID: '${interaction.guildId}' ` +
        `Link_Name: '${doc.name}'`)

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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ultron_view_comp_info')
        .setDescription('Returns various links for comp info')
        .addStringOption(option =>
            option.setName('doc')
                .setDescription('View an existing link')
                .setAutocomplete(true),
        )
    ,
    async autocomplete(interaction, client) {

        option = interaction.options.getFocused(true)

        filtered = null
        choices = []

        unfiltered = []
        docs = await CompDocHelper.fetchCompDocs(client, interaction.guildId)

        for (const doc of docs) {

            privs = await CompDocHelper.fetchCompDocPrivileges(client,
                interaction.guildId, doc.id)

            if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                unfiltered.push(doc)
                continue
            }
            for (const priv of privs) {
                if (await MemberHelper.memberHasPrivilege(client, guildId, interaction.user.id, priv.id)) {
                    unfiltered.push(doc)
                    continue
                }
            }
        }

        filtered = unfiltered.filter(choice => choice.name.toLowerCase().includes(option.value.toLowerCase()))
        filtered.forEach(choice => {
            choices.push({ name: choice.name, value: choice.id.toString() })
        })

        await interaction.respond(choices)
    },
    async execute(interaction, client) {

        if (interaction.options.data.length <= 0) {
            await interaction.reply({ content: "Please select a valid command option ('view') and try again.", ephemeral: ephemeral })
            return
        }

        option = interaction.options.data[0]

        await view_link(interaction, client, option.value)

    },
}