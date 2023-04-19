const { UltronPrivilege, UltronGuild } = require("../database/ultron_sequelize")


var privileges = null

module.exports = {
    async fetchPrivileges(client, guildId = null, force = false) {

        console.log(`Fetch_Privs guild_id: '${guildId}', force: '${force}'`)

        //If we need to grab privileges from db
        if (!(privileges) || force) {
            privileges = await UltronPrivilege.findAll({
                include: UltronGuild, where: {
                    '$UltronGuild.clientId$': client.id
                }
            })
        }

        if (guildId) {
            return privileges.filter(privilege => privilege.UltronGuild.guildId == guildId)
        }
        return privileges
    },

    async fetchPrivilege(client, guildId, privId) {
        await this.fetchPrivileges()

        priv = privileges.filter(fpriv => (fpriv.id == privId && fpriv.UltronGuild.guildId == guildId))

        if (priv.length >= 1) return priv[0];
        return null
    }
}