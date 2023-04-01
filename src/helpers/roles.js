const { UltronGuild, UltronRole, UltronPrivilege } = require("../database/ultron_sequelize")

var ultronroles = null

module.exports = {

    async setup(client) {
        console.log("Setting up Roles")
        await this.load_to_db(client)
        console.log("Finished setting up Roles")
    },

    async load_to_db(client) {

        guilds = client.guilds.cache

        for (guild of guilds) {
            guildId = guild[1].id
            ultronguild = await UltronGuild.findOne({
                where: {
                    clientId: client.id,
                    guildId: guildId
                }
            })
            roles = await guild[1].roles.fetch()
            for (role of roles) {

                await UltronRole.upsert({ UltronGuildId: ultronguild.id, roleId: role[1].id, name: role[1].name })
            }
        }
    },

    async fetchRoles(client, guildId = null, force = false) {
        if (ultronroles == null || force) {
            ultronroles = await UltronRole.findAll({
                include: [UltronGuild, UltronPrivilege], where: {
                    '$UltronGuild.clientId$': client.id
                }
            })
        }

        if (guildId) {
            return ultronroles.filter(role => role.UltronGuild.guildId == guildId)
        }

        return ultronroles
    },

    async fetchRole(client, guildId, roleId) {
        if (!ultronroles) await this.fetchRoles(client);

        role = ultronroles.filter(frole => (frole.UltronGuild.guildId == guildId && frole.roleId == roleId))

        if (role.length < 1) return null;

        return role[0]
    }

}