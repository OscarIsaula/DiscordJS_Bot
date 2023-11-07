import moment from 'moment';

class MiscFunctions {
  djTime = (message) => {
    const now = moment.utc();
    const DJ_SCHEDULE_TIME = "03:15:00";
    const djTime = moment.utc(DJ_SCHEDULE_TIME, 'HH:mm:ss');
      
    if (now.isAfter(djTime)) {
      djTime.add(1, 'day');
    }

    const duration = moment.duration(djTime.diff(now));
    const h = duration.hours();
    const m = duration.minutes();
    const s = duration.seconds();
    const ms = duration.milliseconds();
      
    const response = `DJ_SweatLord and his [Twitch](https://www.twitch.tv/dj_sweatlord)` + 
    ` stream are both going to be online in ${h}h ${m}m ${s}.${ms}s`;
      
    message.channel.send(response);
  };

  randomKekw = (message) => {
    const randomChance = Math.random() < 0.003 ? 1 : 2;
    randomChance === 1 && message.channel.send('<:kekw:761584347098644510>');
  };
  
  coinFlip = (message) => {
    const result = Math.random() < 0.5 ? 'Heads/Yes' : 'Tails/No';
    message.channel.send(result);
  };

  diceRoll = (message, numOfSides) => {
    numOfSides = parseInt(numOfSides);
    const result = Math.floor(Math.random() * numOfSides) + 1;
    message.channel.send(result.toString());
  };
  
}

  export default MiscFunctions;