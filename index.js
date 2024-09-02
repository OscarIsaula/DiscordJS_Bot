import { config } from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';

import Joke from './joke.js';
import FileReader from './quotes.js';
import BungieApi from './bungie_api.js';
import Db from './database.js';
import MiscFunctions from './misc_functions.js';

const jokeInstance = new Joke();
const miscFunctions = new MiscFunctions();
const bungieapi = new BungieApi();
const fileReader = new FileReader('Quotes.txt');
const quotes = fileReader.readLinesFromFile();

const okPattern = /good\s+shit\s+dj|good\s+shit,\s+dj|kinda\s+wanna/i;
const kekwPattern = /why\s+dj|is\s+throws|thanks\s+for|throw\s+so/i;

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.on('ready', async () => {
	try {
		config();
		console.log(`Logged in as ${client.user.tag}!`);
		await Db.connectToDatabase();
		client.user.setActivity({
			name: '!help for commands and info',
		});
	}
	catch (error) {
		console.error('An error occurred:', error);
	}
});

client.login(process.env.TOKEN).catch(console.error);

client.on('messageCreate', async (message) => {
	const content = message.content.toLowerCase();

	switch (true) {
	case content === '!help':
		return fileReader.helpQuote(message);
	case content.startsWith('!day1'):
		return bungieapi.getMembershipInfo(content.slice(6), 'day1', message);
	case content.startsWith('!lowman'):
		return bungieapi.getMembershipInfo(content.slice(8), 'lowman', message);
	case content === '!quote':
		return fileReader.getRandomQuote(quotes, message);
	case content === '!joke':
		return jokeInstance.getRandomJoke(message);
	case content === '!flip':
		return miscFunctions.coinFlip(message);
	case content.startsWith('!roll'):
		return miscFunctions.diceRoll(message, content.slice(5));
	case content === '!dj':
		return miscFunctions.djTime(message);
	case content === '+dj' || content === '+p' || content === '-dj' || content === '-p':
		return Db.getScores(content[0], content.slice(1), message);
	case content === '!was kap blackballed':
		return message.channel.send('no');
	case content.includes('get fucked'):
		return message.channel.send('<:dj:1179636669247398009>');
	case okPattern.test(content):
		return message.channel.send('<:OK:943235677460529223>');
	case kekwPattern.test(content):
		return message.channel.send('<:kekw:761584347098644510>');
	case content.includes('seneca') || content.includes('ronthamasstadon'):
		return miscFunctions.goatGif(message);
	default:
		return miscFunctions.randomKekw(message);
	}
});