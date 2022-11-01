const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

var fs = require('fs');
var Promise = require('polyfill-promise');
//var Sheets = require('google-sheets-api').Sheets;
//var documentId = '1T9DalQHGUat5iU2Mth3T1649EXBVjoHgWAay_6qYY90';
const path = require('path');
const process = require('process');
const {google} = require('googleapis');
//authentication
const key = require(path.join(process.cwd(), 'credentials.json'));
const jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ["https://www.googleapis.com/auth/spreadsheets"],
  null
);
const sheets = google.sheets({ version: "v4", auth: jwtClient });
// var serviceEmail = 'ultron-bot@live-roster.iam.gserviceaccount.com';
// var serviceKey = fs.readFileSync("./src/commands/tools/sheets.pem").toString();
// var sheets = new Sheets({ email: serviceEmail, key: serviceKey });

function embedString(string, data){
    for(var i = 0; i<data.length;i++){
    if(data[i] == ""){
        string = string+"ㅤ\n";
        }else{
            string = string+data[i]+"\n";
        }
    }
    return string;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roster")
    .setDescription("Display Roster From Google")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
async execute(interaction) {
  // Get sheet names
  const res = await sheets.spreadsheets.get({
    spreadsheetId: '1T9DalQHGUat5iU2Mth3T1649EXBVjoHgWAay_6qYY90'
  });
  // Combine sheet names into an array
  let sheetsNames = []
  res.data.sheets.map((x) => {sheetsNames.push(x.properties.title)})
  // Get roster from sheet
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: '1T9DalQHGUat5iU2Mth3T1649EXBVjoHgWAay_6qYY90',
    range: `${sheetsNames[1]}!A1:T28`,
  });
  sheetData = response.data.values
// NOTE: Pulls info from specific cells.
var title = [sheetData[1][2]];
var cmdr = ["<:hll_com:1025923751948341268>" + sheetData[5][2]];
var arty = ["<:hll_arty:1025923654615310338>" + sheetData[7][3],"<:hll_arty:1025923654615310338>" + sheetData[8][3],"<:hll_arty:1025923654615310338>" + sheetData[9][3],"<:hll_arty:1025923654615310338>" + sheetData[10][3],"<:hll_arty:1025923654615310338>" + sheetData[11][3],"<:hll_arty:1025923654615310338>" + sheetData[12][3]];
var recon = ["<:Spotter:1031569808128487424>" + sheetData[15][3],"<:Spotter:1031569808128487424>" + sheetData[17][3]];
var snipe = ["<:hll_tank:1025923672604684318>" + sheetData[20][3]];
var tank1 = ["<:hll_sl:1025923709707497602>" + sheetData[5][6],"<:hll_tank:1025923672604684318>" + sheetData[6][6],"<:hll_tank:1025923672604684318>" + sheetData[7][6]];
var tank2 = ["<:hll_sl:1025923709707497602>" + sheetData[10][6],"<:hll_tank:1025923672604684318>" + sheetData[11][6],"<:hll_tank:1025923672604684318>" + sheetData[12][6]];
var tank3 = ["<:hll_sl:1025923709707497602>" + sheetData[15][6],"<:hll_tank:1025923672604684318>" + sheetData[16][6]];
var reconTranspo = ["<:hll_sl:1025923709707497602>" + sheetData[19][6],"<:hll_sniper:1025923689700671571>" + sheetData[20][6]];
var irn1 = ["<:hll_sl:1025923709707497602>" + sheetData[5][9],"<:hll_infantry:1025923730582548532>" + sheetData[6][9],"<:hll_infantry:1025923730582548532>" +sheetData[7][9],"<:hll_sl:1025923709707497602>" +sheetData[8][9],"<:hll_infantry:1025923730582548532>" +sheetData[9][9],"<:hll_infantry:1025923730582548532>" +sheetData[10][9], "<:hll_sl:1025923709707497602>" +sheetData[11][9],"<:hll_infantry:1025923730582548532>" +sheetData[12][9], "<:hll_infantry:1025923730582548532>" +sheetData[13][9]];
//var thr2 = ["<:hll_sl:1025923709707497602>" + sheetData[5][12],"<:hll_sl:1025923709707497602>" + sheetData[6][12],"<:hll_infantry:1025923730582548532>" +sheetData[7][12],"<:hll_infantry:1025923730582548532>" +sheetData[8][12],"<:hll_infantry:1025923730582548532>" +sheetData[9][12],"<:hll_infantry:1025923730582548532>" +sheetData[10][12]];
var cpt3 = ["<:hll_sl:1025923709707497602>" + sheetData[5][12],"<:hll_infantry:1025923730582548532>" + sheetData[6][12],"<:hll_infantry:1025923730582548532>" +sheetData[7][12],"<:hll_sl:1025923709707497602>" +sheetData[8][12],"<:hll_infantry:1025923730582548532>" +sheetData[9][12],"<:hll_infantry:1025923730582548532>" +sheetData[10][12], "<:hll_sl:1025923709707497602>" +sheetData[11][12], "<:hll_infantry:1025923730582548532>" +sheetData[12][12],"<:hll_infantry:1025923730582548532>" +sheetData[13][12],];
var ant4 = ["<:hll_sl:1025923709707497602>" + sheetData[16][12],"<:hll_infantry:1025923730582548532>" +sheetData[17][12],"<:hll_infantry:1025923730582548532>" +sheetData[18][12]];
var hlk5 = ["<:hll_sl:1025923709707497602>" + sheetData[16][9],"<:hll_infantry:1025923730582548532>" +sheetData[17][9],"<:hll_infantry:1025923730582548532>" +sheetData[18][9], "<:hll_sl:1025923709707497602>" + sheetData[19][9], "<:hll_infantry:1025923730582548532>" +sheetData[20][9]];
var aux6 = ["<:hll_sl:1025923709707497602>" + sheetData[6][15],"<:hll_infantry:1025923730582548532>" +sheetData[7][15]];
var simp7 = ["<:simp:1031570292125999115>" + sheetData[11][15]];
//var prb = ["<:hll_sl:1025923709707497602>" + sheetData[18][12],"<:hll_infantry:1025923730582548532>" +sheetData[19][12]];
var mg = ["<:mg:1031570306323714068>" + sheetData[16][15], "<:mg:1031570306323714068>" + sheetData[17][15]];
//creates the strings from the cells above.
    var titlestring = "";
    var cmdrstring = "";
    var artystring = "";
    var reconstring = "";
    var snipestring = "";
    var tank1string = "";
    var tank2string = "";
    var tank3string = "";
    var reconTranspostring = "";
    var irn1string = "";
    //var thr2string = "";
    var cpt3string = "";
    var ant4string = "";
    var hlk5string = "";
    var aux6string = "";
    var simp7string = "";
    //var prbstring = "";
    var mgstring = "";
//applys strings to named cells.  
    titlestring = embedString(titlestring, title);  
    cmdrstring = embedString(cmdrstring, cmdr);
    artystring = embedString(artystring, arty);
    reconstring = embedString(reconstring, recon);
    snipestring = embedString(snipestring, snipe);
    tank1string = embedString(tank1string, tank1);
    tank2string = embedString(tank2string, tank2);
    tank3string = embedString(tank3string, tank3);
    reconTranspostring = embedString(reconTranspostring, reconTranspo);
    irn1string = embedString(irn1string, irn1);
    //thr2string = embedString(thr2string, thr2);
    cpt3string = embedString(cpt3string, cpt3);
    ant4string = embedString(ant4string, ant4);
    hlk5string = embedString(hlk5string, hlk5);
    aux6string = embedString(aux6string, aux6);
    simp7string = embedString(simp7string, simp7);
    //prbstring = embedString(prbstring, prb);
    mgstring = embedString(mgstring, mg);

    const rosterEmbed = new EmbedBuilder()
                .setTitle("♿ **"+ titlestring +"**")
                .setDescription("**Roster for the upcoming match:**")
                .setColor(0x800080)
                //.setImage("https://cdn.discordapp.com/attachments/936543359974121542/1008366676200411287/GOF.gif")({extension: 'mp4', size: 4096})
                .setFooter({
                  iconURL:
                    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/907a507d-e421-4e1c-a7f9-a27a30cabd66/df2hcd0-4292b6df-74b3-4eff-a649-3e4b319300c9.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzkwN2E1MDdkLWU0MjEtNGUxYy1hN2Y5LWEyN2EzMGNhYmQ2NlwvZGYyaGNkMC00MjkyYjZkZi03NGIzLTRlZmYtYTY0OS0zZTRiMzE5MzAwYzkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.9hE9xeqK_NrJDA02KEXxPUatldwFFQakkgpD0rSmIag",
                  text: "Powered by Stark Industries",
                })
                .addFields(
                    {
                      "name": "```CMDR```",
                      "value": cmdrstring,
                      "inline": true
                    },
                                    {
                      "name": "```SIMPS [SMP]```",
                      "value": simp7string,
                      "inline": true
                    },
                    {
                              "name": "```ARTY SNIPE```",
                      "value": snipestring,
                      "inline": true
                    },
                        {
                      "name": "```TANK 1 [T1]```",
                      "value": tank1string,
                      "inline": true
                    },
                    {
                      "name": "```TANK 2 [T2]```",
                      "value": tank2string,
                      "inline": true
                    },
                    {
                      "name": "```TANK 3 [FXT]```",
                      "value": tank3string,
                      "inline": true
                    },
                        {
                      "name": "```1 | IRONMAN [IRN] 🟡```",
                      "value": irn1string,
                      "inline": true
                    },
                    {
                      "name": "ㅤ",
                      "value": "ㅤ",
                      "inline": true
                    },
                    {
                      "name": "```2 | CPT AMERICA [CPT] 🔴```",
                      "value": cpt3string,
                      "inline": true
                    },
                    {
                      "name": "```3 | HULK [HLK] 🟢```",
                      "value": hlk5string,
                      "inline": true
                    },
                    {
                      "name": "```4 | ANTMAN [ANT] 🟠```",
                      "value": ant4string,
                      "inline": true
                    },
                    {
                      "name": "```ARTILLERY```",
                      "value": artystring,
                      "inline": true
                    },
                    {
                      "name": "```AUXILLERY [AUX]```",
                      "value": aux6string,
                      "inline": true
                    },
                    {
                      "name": "```RECON```",
                      "value": reconstring,
                      "inline": true
                    },
                            {
                      "name": "```RECON TRANSPORT```",
                      "value": reconTranspostring,
                      "inline": true
                    },
                    {
                      "name": "ㅤ",
                      "value": "ㅤ",
                      "inline": true
                    },
                    {
                      "name": "```MG FLEX```",
                      "value": mgstring,
                      "inline": true
            },)
                    return interaction.reply({embeds: [rosterEmbed], ephemeral: false})
}
}
