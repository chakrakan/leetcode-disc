const Discord = require('discord.js');
const client = new Discord.Client();

const prefix = '!';

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
	console.log(msg.content);
	if (msg.content.includes(`${prefix}problem`)) {
		msg.reply('Here\'s a random leetcode problem for you:');
	}
});

client.login(process.env.DISCORD_BOT_TOKEN);