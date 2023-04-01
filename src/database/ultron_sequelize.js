const { Sequelize, DataTypes, Model } = require('sequelize')

const credentials = {
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};

const sequelize = new Sequelize(`postgres://` +
    `${credentials.user}:${credentials.password}` +
    `@${credentials.host}:${credentials.port}` +
    `/${credentials.database}`, { logging: false });

async function setup(client) {

    await sequelize.authenticate()
    await sequelize.sync({ force: false })

    client.sequelize = sequelize
}

async function load_db(client) {
    await require("../helpers/guilds").setup(client)
    await require("../helpers/roles").setup(client)
    await require("../helpers/members").setup(client)
}

class UltronGuild extends Model { }
UltronGuild.init({
    clientId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    guildId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: 'client_guild_uk'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'client_guild_uk'
    }
}, { sequelize })

class UltronPrivilege extends Model { }
UltronPrivilege.init({
    name: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING
    },
}, { sequelize })


class UltronRole extends Model { }
UltronRole.init({
    roleId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
}, { sequelize })


class UltronMember extends Model { }
UltronMember.init({
    memberId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
    },
    displayName: {
        type: DataTypes.STRING(64),
    }
}, { sequelize })


class UltronCompDoc extends Model { }
UltronCompDoc.init({
    name: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(1024),
    },
}, { sequelize })


//associations

//Ultron Guilds
UltronGuild.belongsToMany(UltronMember, { through: "UltronGuildMembers" })
UltronGuild.hasMany(UltronRole)
UltronGuild.hasMany(UltronPrivilege)
UltronGuild.hasMany(UltronCompDoc)


//Ultron Privileges
UltronPrivilege.belongsTo(UltronGuild, {
    foreignKey: {
        allowNull: false,
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
UltronPrivilege.belongsToMany(UltronRole, { through: "UltronRolePrivileges" })
UltronPrivilege.belongsToMany(UltronCompDoc, { through: "UltronCompDocPrivileges" })


//Ultron Roles
UltronRole.belongsTo(UltronGuild, {
    foreignKey: {
        allowNull: false,
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})
UltronRole.belongsToMany(UltronPrivilege, { through: 'UltronRolePrivileges' })
UltronRole.belongsToMany(UltronMember, { through: 'UltronMemberRoles' })

//Ultron Members
UltronMember.belongsToMany(UltronGuild, { through: "UltronGuildMembers" })
UltronMember.belongsToMany(UltronRole, { through: 'UltronMemberRoles' })

//Ultron Comp Docs
UltronCompDoc.belongsTo(UltronGuild, {
    foreignKey: {
        allowNull: false
    },
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
})
UltronCompDoc.belongsToMany(UltronPrivilege, { through: "UltronCompDocPrivileges" })

module.exports = { setup, load_db, UltronGuild, UltronPrivilege, UltronRole, UltronMember, UltronCompDoc }