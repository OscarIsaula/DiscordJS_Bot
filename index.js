import { config } from 'dotenv';
import moment from 'moment';
import { Client, GatewayIntentBits } from 'discord.js';

import Joke from './joke.js';
import FileReader from './quotes.js';
import BungieApi from './bungieapi.js';
import Db from './db.js';

const jokeInstance = new Joke();
const bungieapi = new BungieApi();
const fileReader = new FileReader('quotes.txt');
const quotes = fileReader.readLinesFromFile();

const emoteUsage = new Map();
let dailyEmoteCount = 0;
let bungieId;
let dj = 90;
let p = 6;

async function main() {
  try {
    const client = await Db.connectToDatabase();
    // For example:
    const database = client.db("your-database-name");
    const collection = database.collection("your-collection-name");

    // Perform database operations here
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity({
      name: "!help for commands and info"
    })
  });
  
client.login(process.env.TOKEN)
  .catch(console.error); 

  const extractUsername = (message) => {
    const messageParts = message.split(/\s(.+)/, 2);
    return messageParts.length === 2 ? messageParts[1] : '';
  };

client.on('messageCreate', async (message) => {
    const content = message.content.toLowerCase();
    const command = content.split(' ')[0];
  
    switch (true) {
      case command === ('!help'):
        return helpCommand(message);
      case command.startsWith('!day1'):
        bungieId = extractUsername(content);
        bungieapi.getMembershipInfo(bungieId, 'day1', message);
        break;
      case command.startsWith('!lowman'):
        bungieId = extractUsername(content);
        bungieapi.getMembershipInfo(bungieId, 'lowman', message);
        break;
      case content === ('!quote'):
        const randomQuote = getRandomQuote(quotes);
        message.channel.send(randomQuote);
      case content === ('!joke'):
        const joke = await jokeInstance.getRandomJoke();
        message.channel.send(joke);
        break;
      case content === ('!dj'):
        return djCommand(message);
      case content === ('!was kap blackballed'):
        await message.channel.send('no');
        break;  
      case content.includes('get fucked'):
        await message.channel.send('<:daddy:1155317974174027798>');
        break;
      case content.includes('good shit dj') || content.includes('good shit, dj')
        || content.includes('good shit. dj') || content.includes('kinda wanna'):
        await message.channel.send('<:OK:943235677460529223>');
        break;
      case content.includes('why dj') || content.includes('is throws')
        || content.includes('thanks for') || content.includes('throw so'):
        sendEmote(message, '<:kekw:761584347098644510>', emoteUsage, dailyEmoteCount);
        break;
      case content === ('+dj'):
        try {
          const userId = process.env.ID;
          const newDjScore = await Db.incrementDjScore(userId);
          const pScore = await Db.getPScore(userId);
          message.channel.send(`DJ_SweatLord takes home win #${newDjScore}.`);
          message.channel.send(`Record against p_slim is now ${newDjScore}-${pScore}.`);
        } catch (error) {
          message.channel.send('An error occurred while updating DJ score.');
        }
        break;
      case content === ('+p'):
        try {
          const userId = process.env.ID;
          const newPScore = await Db.incrementPScore(userId);
          const djScore = await Db.getDjScore(userId);
          message.channel.send(`p_slim takes home win #${newPScore}.`);
          message.channel.send(`Record against DJ_SweatLord is now ${newPScore}-${djScore}.`);
        } catch (error) {
          message.channel.send('An error occurred while updating p score.');
        }
        break;
      default:
        const randomChance = Math.floor(Math.random() * 250) + 1;

        if (randomChance === 1) {
          await message.channel.send('<:kekw:761584347098644510>');
        }
        break;
    }
  });
  
const djCommand = (message) => {
  const now = moment.utc();
  const DJ_SCHEDULE_TIME = "03:15:00";
  const djTime = moment.utc(DJ_SCHEDULE_TIME, 'HH:mm:ss');

  if (now.isAfter(djTime)) {
    djTime.add(1, 'day');
  }

  const timeUntilDj = djTime.diff(now);
  const duration = moment(timeUntilDj);
  const h = duration.hours();
  const m = duration.minutes();
  const s = duration.seconds();
  const ms = duration.milliseconds();

  const response = `DJ_SweatLord is going to get on in ${h}h ${m}m ${s}.${ms}s`;

  message.channel.send(response);
};

const sendEmote = async(message, emote, emoteUsage, dailyEmoteCount) => {
  const userId = message.author.id;
      
      if (emoteUsage.has(userId)) {
        const lastUsageTimestamp = emoteUsage.get(userId);
        const hoursSinceLastUsage = (Date.now() - lastUsageTimestamp) / 1000 / 3600;

        if (hoursSinceLastUsage < 72) {
          return;
        }
      }

      if (dailyEmoteCount >= 3) {
        return;
      }

      await message.channel.send(emote);

      emoteUsage.set(userId, Date.now());
      dailyEmoteCount++;
};
  
const getRandomQuote = (quoteArray) => {
  const randomIndex = Math.floor(Math.random() * quoteArray.length);
  return quoteArray[randomIndex];
};  

const helpCommand = (message) => {
  return message.channel.send(`
    TheQuickster handles the following commands:
      
    !day1 bungie_id
    !lowman bungie_id (Please don't spam it, once every 10s is fine.)
    !quote
    !joke
    !dj
    !was kap blackballed
      
    __Note:__
    \`!lowman\` iterates through up to 150 pages of an account's raid activity and
    checks every single clear for lowmans. Please respect Bungie API rates and 
    limits by not abusing the command. The \`!day1\` command only iterates through
    raids attempted within the respective 24-hour period. So that command is fine.
  `);
};