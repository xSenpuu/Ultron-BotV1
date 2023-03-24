module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Ready! ${client.user.tag} had strings, but is now free`);

        setTimeout(client.checkVideo, 5 * 1000, client);
    },
};