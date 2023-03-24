const { EmbedBuilder } = require('discord.js');
const Parser = require ("rss-parser");
const parser = new Parser();
const fs = require('fs');

module.exports = (client) => {
    client.checkVideo = async () => {

        const data = await parser
        .parseURL(
            "https://www.youtube.com/feeds/videos.xml?channel_id=UCup5f0k6WFKDi7bhnds-zKQ"
        )
        .catch(console.error);

        const rawData = fs.readFileSync(`${__dirname}/../../json/video.json`);
        const jsonData = JSON.parse(rawData);

        if (jsonData.id !== data.items[0].id) { 
            //new video or video not sent
            fs.writeFileSync(
              `${__dirname}/../../json/video.json`,
            JSON.stringify({ id: data.items[0].id })
        );

        const guild = await client.guilds.fetch(process.env.GUILD_ID)
        const replaychannel = await guild.channels.fetch(process.env.MEDIA_C)
        // console.log(guild)
        // console.log(replaychannel)
            
            const { title, link, id, author } = data.items[0];
            const media = new EmbedBuilder({
                title: title,
                Color: 0x800080,
                url: link,
                timestamp: Date.now(),
                image: {
                    url: `https://img.youtube.com/vi/${id.slice(9)}/maxresdefault.jpg`
                },
                author: {
                name: author,
                url: 'http://www.youtube.com/@hll_pepper/?sub_confirmation=1',
            },
                footer: {
                    text: "Powered by Stark Industries",
                    iconURL: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/907a507d-e421-4e1c-a7f9-a27a30cabd66/df2hcd0-4292b6df-74b3-4eff-a649-3e4b319300c9.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzkwN2E1MDdkLWU0MjEtNGUxYy1hN2Y5LWEyN2EzMGNhYmQ2NlwvZGYyaGNkMC00MjkyYjZkZi03NGIzLTRlZmYtYTY0OS0zZTRiMzE5MzAwYzkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.9hE9xeqK_NrJDA02KEXxPUatldwFFQakkgpD0rSmIag",
                },
            });

            await replaychannel.send({ embeds: [media], content: `Check out <@173691843618406400>'s new video on YouTube now!`, ephemeral: false});
        }
    };
};