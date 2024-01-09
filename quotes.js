import { readFileSync } from 'fs';

class FileReader {
  constructor(fileName) {
    this.fileName = fileName;
  }

  readLinesFromFile = () => {
    try {
      const fileContent = readFileSync(this.fileName, 'utf8');
      const lines = fileContent.split('\n');
      return lines;
    } catch (error) {
      console.error('Error reading file:', error.message);
      return [];
    }
  };

  getRandomQuote = (quoteArray, message) => {
    const randomIndex = Math.floor(Math.random() * quoteArray.length);
    message.channel.send(quoteArray[randomIndex]);
  };

  helpQuote = (message) => {
    message.channel.send(
      "TheQuickster handles the following commands:\n\n" +
      "!day1 bungie_id\n" +
      "!lowman bungie_id (Please don't spam it, once every 10s is fine.)\n" +
      "!quote\n" +
      "!joke\n" +
      "!flip\n" +
      "!roll(x)\n" +
      "!dj\n" +
      "+p/+dj/-p/-dj\n" +
      "!was kap blackballed\n\n" +
      "__Note:__\n" +
      "`!lowman` iterates through up to 150 pages of an account's raid activity and " +
      "checks every single clear for lowmans. Please respect Bungie API rates and " +
      "limits by not abusing the command. The `!day1` command only iterates through " +
      "raids attempted within the respective 24-hour period. So that command is fine."
    );
  };
}

export default FileReader;