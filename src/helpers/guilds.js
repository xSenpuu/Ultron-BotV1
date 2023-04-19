

const { Client } = require("pg")
const { UltronGuild } = require("../database/ultron_sequelize")

var ultronguilds = null

module.exports = {

    async setup(client) {
        console.log("Setting up Guilds")
        await this.load_to_db(client)
        console.log("Finished setting up Guilds")
    },

    async load_to_db(client) {

        guilds = await client.guilds.fetch()

        for (const guild of guilds) {
            await UltronGuild.upsert({ clientId: client.id, guildId: guild[1].id, name: guild[1].name })
        }

        this.fetchGuilds(client, null, true)
    },

    async fetch_guilds(client, guildId = null, force = false) {

        if (ultronguilds == null || force) {
            ultronguilds = await UltronGuild.findAll({ where: { clientId: client.id } })
        }

        if (guildId) {
            return ultronguilds.filter(guild => guild.guildId == guildId)
        }
        return ultronguilds
    },

    async fetchGuilds(client, guildId = null, force = false) {
        return await this.fetch_guilds(client, guildId, force)
    },

    async fetchGuild(client, guildId) {
        await this.fetch_guilds(client)

        guild = ultronguilds.filter(fguild => (fguild.guildId == guildId && fguild.clientId == client.id))

        if (guild.length > 0) return guild[0]
        return null
    }


}
