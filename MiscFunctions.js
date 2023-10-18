import moment from 'moment';

class TimeFunctions {
  djTime = (message) => {
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
      
    const response = `DJ_SweatLord and his [Twitch](https://www.twitch.tv/dj_sweatlord)` + 
    ` stream are both going to be online in ${h}h ${m}m ${s}.${ms}s`;
      
    return message.channel.send(response);
  };

  randomKekw(message) {
    const randomChance = Math.floor(Math.random() * 250) + 1;

      if (randomChance === 1) {
        return message.channel.send('<:kekw:761584347098644510>');
      }
  }
}

  export default TimeFunctions;