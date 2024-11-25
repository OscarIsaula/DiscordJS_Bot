import moment from 'moment-timezone';

class MiscFunctions {
  djTime = (message) => {
    moment.tz.setDefault('America/New_York');
    const now = moment();
    const DJ_SCHEDULE_TIME = "23:15:00";
    const djTime = moment(DJ_SCHEDULE_TIME, 'HH:mm:ss');
      
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
    randomChance === 2 && this.randomReaction(message);
  };

  randomReaction = (message) => {
    const reaction = Math.random();
    const id = message.author.id;

    switch (true) {
      case (id == 290831327924715521 && reaction > 0.9):
        return message.react('😐')
      case (reaction < 0.0025):
        return message.react('<:dj:1179636669247398009>');
      case (reaction <= 0.005 && reaction > 0.0025):
        return message.react('<:jayson:1180221462368485396>');
      case (reaction <= 0.0075 && reaction > 0.005):
        return message.react('<:OK:943235677460529223>');
      case (reaction <= 0.01 && reaction > 0.0075):
        return message.react('<:harold:1153568158150578216>');
      case (reaction <= 0.0125 && reaction > 0.01):
        return message.react('<:kekw:761584347098644510>');
    }
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

  goatGif = (message) => {
    const gif = Math.random();
    switch (true) {
      case (gif < 0.25):
        return message.channel.send('https://giphy.com/gifs/tongue-goat-cMso9wDwqSy3e');
      case (gif <= 0.5 && gif > 0.25):
        return message.channel.send('https://giphy.com/gifs/funny-goat-CzHhegH2ZGsPS');
      case (gif <= 0.75 && gif > 0.5):
        return message.channel.send('https://giphy.com/gifs/hat-enjoy-buddy-yQNh7v1vKiE4U');
      case (gif <= 1 && gif > 0.75):
        return message.channel.send('https://giphy.com/gifs/goat-3oEduYhWuU6OLRSXbG');

    }
  }
  
}

  export default MiscFunctions;