const { Client, MessageEmbed } = require('discord.js');
const axios = require('axios');
const client = new Client({
	intents: ["GUILDS", "GUILD_MESSAGES",],
});

const prefix = '!problem';
const problemUrlBase = 'https://leetcode.com/problems/';
const ltApiUrl = 'https://leetcode.com/api/problems/all/';
const allProblems = [];
const freeProblems = [];
const paidProblems = [];
let totalProblems;

/**
 * Returns a random number based on provided max constraint.
 * @param {int} max
 */
function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Problem class to help parse the revelant properties of a problem from the Leetcode API
 * @param {*} problemObject
 */
function Problem(problemObject) {
	this.id = problemObject.stat.question_id;
	this.title = problemObject.stat.question__title;
	this.titleSlug = problemObject.stat.question__title_slug;
	this.difficulty =
    problemObject.difficulty.level === 3 ? 'Hard' : problemObject.difficulty.level === 2 ? 'Medium' : 'Easy';
	this.paidOnly = problemObject.paid_only;
	this.description = `Problem ID: ${this.id}\nTitle: ${this.title}\nSlug Title: ${this.titleSlug}\nDifficulty: ${this.difficulty}\nIs Paid? ${this.paidOnly}`;
}

/**
 * REST call to populate our arrays with data.
 */
axios
	.get(ltApiUrl)
	.then((resp) => {
		totalProblems = resp.data.num_total;
		resp.data.stat_status_pairs.forEach((problem) => {
			const newProblem = new Problem(problem);
			// ToDo need to fix .filter but this works in the mean time
			if (newProblem.paidOnly === false) {
				freeProblems.push(newProblem);
			}
			else {
				paidProblems.push(newProblem);
			}
			allProblems.push(newProblem);
		});
	})
	.catch((err) => {
		console.log("REST call error");
		console.log(err);
	});

// Bot code

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

/**
 * Takes in the relevant array for the operation based on command and the message received by the bot.
 * Builds the MessageEmbed object with relevant info to be sent out to the particular channel/user.
 * @param {*} data
 * @param {*} msg
 * @param {string} diff
 */
function problemType(data, msg, diff = '', number = 'unused') {
	if (diff != '') {
		const filteredByDiff = data.filter(
			(problem) => problem.difficulty.toLowerCase() === diff,
		);
		data = filteredByDiff;
	}
	let missingProblem = false;
	const dataLen = data.length;
	const randProblem = getRandomInt(dataLen);
	let aProblem = data[randProblem];
	// check if invalid problem #
	if (number !== 'unused') {
		aProblem = data.filter(obj => {
			return obj.id === number;
		})[0];
		if (typeof aProblem === 'undefined') {
			missingProblem = true;
			console.log('set missingProblem = true');
			aProblem = data[randProblem];
		}
	}
	const problemUrl = problemUrlBase + aProblem.titleSlug + '/';

	const embed = new MessageEmbed()
		.setTitle(aProblem.title)
		.setColor('#f89f1b')
		// online image from leetcode website for thumbnail (pls don't go down)
		.setThumbnail('https://leetcode.com/static/images/LeetCode_logo_rvs.png')
		// ToDo Scrape problem descriptions, add to object and embed (haHA might not do this)
		.setDescription(`${aProblem.difficulty} ${
			aProblem.paidOnly ? 'locked/paid' : 'unlocked/free'
		} problem.`)
		.setURL(problemUrl);
	if (missingProblem) {
		msg.author.send('Problem #' + number + ' is not a valid problem.')
			.then(() => console.log(`Replied to message "${msg.content}"`))
			.catch(console.error);
		msg.delete();
	} else {
		msg.channel.threads.create({
			name: aProblem.title,
			autoArchiveDuration: 1440,
			reason: 'Thread to discuss problem #' + aProblem.id,
		})
			.then(threadChannel => {
				console.log(embed);
				threadChannel.send({
					embeds: [embed],
				});
			})
			.catch(console.error);
		msg.delete()
			.then(message => console.log(`Deleted message from ${message.author.username}`))
			.catch(console.error);
	}
}

client.on('messageCreate', (msg) => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
	let diff;
	let problemNumber;

	if (typeof args[0] != 'undefined') {
		const temp = args[0].toLowerCase();
		if (['easy', 'medium', 'hard'].indexOf(temp) >= 0) {
			diff = temp;
		}
		else {
			// try catch because I don't want to read Javascript that carefully :)
			try {
				problemNumber = parseInt(temp);
				console.log('parsed number: #' + problemNumber + ' for problem');
			}
			catch (e) {
				console.log('failed to parse number for problem');
				console.log('tried to parse: ##' + temp + '##');
				console.log('type: ' + typeof(temp));
				console.log(e);
			}
		}
	}

	if (command === 'info') {
		msg.channel.send(
			`Leetcode currently has a total of ${totalProblems} problems of which ${freeProblems.length} are free, and ${paidProblems.length} are paid.`,
		);
	}
	else if (command === 'number') {
		problemType(freeProblems, msg, diff, problemNumber);
	}
	else if (Number.isInteger(parseInt(command))) {
		msg.author.send(
			'You sent invalid message: ' + msg.content +
			'```Usage:\n\n\t!problem (without args) - gives you a random problem of any difficulty either paid/free.' +
			'\n\n\t!problem free - gives you a random freely accessible problem of any difficulty.' +
			'\n\n\t!problem paid - gives you a random paid/locked problem of any difficulty.' +
			'\n\n\t!problem number # - gives you a random paid/locked problem of any difficulty.' +
			'\n\nAdding difficulty modifiers:\n\n\t!problem <free | paid> <easy | medium | hard> - lets you pick a random free or paid problem of the chosen difficulty.```',
		)
			.then(() => console.log(`Replied to message "${msg.content}"`))
			.catch(console.error);
	}
	else if (command === 'free') {
		problemType(freeProblems, msg, diff);
	}
	else if (command === 'paid') {
		problemType(paidProblems, msg, diff);
	}
	else if (command === 'help') {
		msg.channel.send(
			'```Usage:\n\n\t!problem (without args) - gives you a random problem of any difficulty either paid/free.' +
			'\n\n\t!problem free - gives you a random freely accessible problem of any difficulty.' +
			'\n\n\t!problem paid - gives you a random paid/locked problem of any difficulty.' +
			'\n\n\t!problem number # - gives you a random paid/locked problem of any difficulty.' +
			'\n\nAdding difficulty modifiers:\n\n\t!problem <free | paid> <easy | medium | hard> - lets you pick a random free or paid problem of the chosen difficulty.```',
		);
	}
	else {
		problemType(allProblems, msg, diff);
	}
});

client.login(process.env.DISCORD_BOT_TOKEN);
