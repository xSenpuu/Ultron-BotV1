const { UltronCompDoc, UltronGuild, UltronPrivilege } = require("../database/ultron_sequelize")

var ultroncompdocs = null

module.exports = {
    async fetchCompDocs(client, guildId = null, force = null) {
        if (ultroncompdocs == null || force) {
            ultroncompdocs = await UltronCompDoc.findAll({
                include: [UltronGuild, UltronPrivilege], where: {
                    '$UltronGuild.clientId$': client.id
                }
            })
        }

        if (guildId) {
            return ultroncompdocs.filter(doc => doc.UltronGuild.guildId == guildId)
        }

        return ultroncompdocs
    },

    async fetchCompDoc(client, guildId, compDocId) {
        await this.fetchCompDocs(client);

        // console.log(`Fetching Comp Doc for GuildId: '${guildId}' DocId: '${compDocId}'`)
        // console.log(ultroncompdocs)
        doc = ultroncompdocs.filter(fdoc => (fdoc.id == compDocId && fdoc.UltronGuild.guildId == guildId))

        if (doc.length >= 1) {
            return doc[0]
        }
        return null
    },

    async fetchCompDocPrivileges(client, guildId, compDocId) {

        doc = await this.fetchCompDoc(client, guildId, compDocId)
        if (doc)
            return doc.UltronPrivileges
        return []
    },

    async compDocHasPrivilege(client, guildId, compDocId, privId) {
        privs = await this.fetchCompDocPrivileges(client, guildId, compDocId)

        priv = privs.filter(fpriv => fpriv.id = privId)

        return (priv.length >= 1)
    },

    async compDocAddPrivilege(client, compdoc, priv) {
        await compdoc.addUltronPrivilege(priv)
        await this.fetchCompDocs(client, null, true)
    },

    async compDocRevokePrivilege(client, compdoc, priv) {
        await compdoc.removeUltronPrivilege(priv)
        await this.fetchCompDocs(client, null, true)
    }


}