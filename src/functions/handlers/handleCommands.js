const config = require('config');
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

const TOKEN= config.get('ultron.token');
const CLIENT_ID = config.get('ultron.client_id');
const GUILD_ID= config.get('ultron.guild_id');

module.exports = (client) => {
  client.handleCommands = async () => {
    const suiteFolders = fs.readdirSync("./src/suites");
    //const commandFolders = fs.readdirSync("./src/commands");
    
    const { commands, commandArray } = client;

    for(const suiteFolder of suiteFolders){
      
      var files = fs
        .readdirSync(`./src/suites/${suiteFolder}/commands`)
        .filter((file) => file.endsWith(".js"));

        for (const file of files) {
          const command = require(`../../suites/${suiteFolder}/commands/${file}`);
          commands.set(command.data.name, command);
          commandArray.push(command.data.toJSON());
          console.log(
            `Command: ${command.data.name} has been passed through the handler`
          );
        }

        const commandFolders = fs
          .readdirSync(`./src/suites/${suiteFolder}/commands`)
          .filter((file) => !file.endsWith(".js"));

      for (const folder of commandFolders) {
        
        const commandFiles = fs
          .readdirSync(`./src/suites/${suiteFolder}/commands/${folder}`)
          .filter((file) => file.endsWith(".js"));
        
        for (const file of commandFiles) {
          const command = require(`../../suites/${suiteFolder}/commands/${folder}/${file}`);
          commands.set(command.data.name, command);
          commandArray.push(command.data.toJSON());
          console.log(
            `Command: ${command.data.name} has been passed through the handler`
          );
        }
      }
    }

    const clientId = CLIENT_ID;
    const guildId = GUILD_ID;
    const rest = new REST({ version: "9" }).setToken(TOKEN);
    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: client.commandArray,
      });

      console.log("Successfully reloaded application (/) commands. ");
    } catch (error) {
      console.error(error);
    }
  };
};