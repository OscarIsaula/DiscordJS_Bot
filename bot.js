require('dotenv').config();
const moment = require('moment');
const Joke = require('./joke.js');
const FileReader = require('./quotes.js');
const BungieApi = require('./bungieapi.js');
const { Client, GatewayIntentBits } = require('discord.js');
let bungieId;

const jokeInstance = new Joke();
const bungieapi = new BungieApi();
const fileReader = new FileReader('quotes.txt');
const quotes = fileReader.readLinesFromFile();
const emoteUsage = new Map();
let dailyEmoteCount = 0;
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
      case content.includes('why dj') || content.includes('is throws'):
        sendEmote(message, '<:kekw:761584347098644510>', emoteUsage, dailyEmoteCount);
        break;
      default:
        const randomChance = Math.floor(Math.random() * 100) + 1;

        if (randomChance === 1) {
          await message.channel.send('<:kekw:761584347098644510>');
        }
        break;
    }
  });
  
const djCommand = (message) => {
  const now = moment();
  const DJ_SCHEDULE_TIME = "03:15:00";
  const djTime = moment(DJ_SCHEDULE_TIME, 'HH:mm:ss');

  if (now.isAfter(djTime)) {
    djTime.add(1, 'day');
  }

  const timeUntilDj = djTime.diff(now);
  const duration = moment.duration(timeUntilDj);
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();
  const milliseconds = duration.milliseconds();

  const response = `DJ_SweatLord is going to get on in' +  
    '${hours}h ${minutes}m ${seconds}.${milliseconds}s`;

  message.channel.send(response);
};

const sendEmote = async(message, emote, emoteUsage, dailyEmoteCount) => {
  const userId = message.author.id;
      
      if (emoteUsage.has(userId)) {
        const lastUsageTimestamp = emoteUsage.get(userId);
        const hoursSinceLastUsage = (Date.now() - lastUsageTimestamp) / 1000 / 3600;

        if (hoursSinceLastUsage < 48) {
          return;
        }
      }

      if (dailyEmoteCount >= 5) {
        return;
      }

      await message.channel.send(emote);

      emoteUsage.set(userId, Date.now());
      dailyEmoteCount++;
};
  
  const getRandomQuote = (quoteArray) => {
    if (quoteArray.length === 0) {
      return 'No quotes available.';
    }
  
    const randomIndex = Math.floor(Math.random() * quoteArray.length);
    return quoteArray[randomIndex];
  };  

  helpCommand = (message) => {
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