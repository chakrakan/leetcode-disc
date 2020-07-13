const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
	if (msg.content === 'problem') {
		msg.reply('Here\'s a random leetcode problem for you:');
	}
});

client.login(process.env.token);