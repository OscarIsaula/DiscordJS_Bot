import { config } from 'dotenv';
import axios from 'axios';
import moment from 'moment';
import { EmbedBuilder } from 'discord.js';
import { raids } from './Raid.js';

class DayOne {
  constructor() {
    config();
    this.raids = raids;
    this.webClient = axios.create({
      baseURL: 'https://www.bungie.net/Platform',
      headers: {
        'X-API-Key': process.env.KEY,
        'Content-Type': 'application/json',
      },
    });
  }

  async getActivityHistory(characterIds, membershipType, membershipId, message) {
  
    for (let page = 0; page < 50; page++) {
      for (const characterId of characterIds) {
        const pageNum = page.toString();
        const activityHistoryPath = `/Destiny2/${membershipType}/Account/${membershipId}/Character/${characterId}/Stats/Activities/`;
  
        try {
          const response = await this.webClient.get(activityHistoryPath, {
            params: {
              mode: '4', // 4 for raids
              count: '100',
              page: pageNum,
            },
          });
          const responseBody = response.data;
          this.parseActivityHistory(responseBody, message);
        } catch (error) {
          console.error('Error accessing Bungie API:', error.message);
        }
      }
    }
  }

  parseActivityHistory = (responseBody, message) => {
    const responseData = responseBody.Response;
  
    if (!responseData.activities) {
      return;
    }
    const activities = responseData.activities;
  
    const raidList = [
      raids.LW,
      raids.SotP,
      raids.CoS,
      raids.GoS,
      raids.DSC,
      raids.VoG,
      raids.VoG2,
      raids.VotD,
      raids.KF,
      raids.KF2,
      raids.RoN,
      raids.CE,
      raids.CE2,
    ];
  
    for (let i = 0; i < activities.length; i++) {
      const activity = activities[i];
      const activityHash = activity.activityDetails.referenceId;
  
      raidList
        .filter((raid) => raid !== null && activityHash.toString() === raid.hash)
        .forEach((raid) => this.processRaid(activity, raid, message));
    }
  };
  
  processRaid = async (activity, raid, message) => {
    const values = activity.values;
    const completedValue = values.completed.basic.value;

    if (completedValue === 1.0) {
      const startTime = moment(activity.period);
      const activityDurationSeconds = values.activityDurationSeconds.basic.value;
      const completionTime = moment(startTime).add(activityDurationSeconds, 'seconds');
      const raidLaunchTime = moment(raid.releaseTime);
      const timeDifference = completionTime.diff(raidLaunchTime, 'hours');

      if (timeDifference <= raid.hours) {
        const hoursAfterLaunch = completionTime.diff(raidLaunchTime, 'hours');
        const minutesAfterLaunch = completionTime.diff(raidLaunchTime, 'minutes') % 60;

        const instanceId = activity.activityDetails.instanceId;
        const duration = values.activityDurationSeconds.basic.displayValue;
        const time = completionTime.utc().format('YYYY-MM-DD HH:mm');
        const result = `Cleared ${hoursAfterLaunch}h ${minutesAfterLaunch}m post launch @ ${time} UTC\n` +
          `Instance Duration: ${duration} -> [Raid Report](https://raid.report/pgcr/${instanceId})`;

        const embed = this.buildDay1Embed(result, raid.name);

        try {
          await message.channel.send({ embeds: [embed] });
        } catch (error) {
          console.error('Error sending message:', error.message);
        }
      }
    }
  };
  
  buildDay1Embed = (results, raidName) => {
    const embed = new EmbedBuilder()
      .setColor('#FF6464')
      .setTitle(raidName)
      .setDescription(results)
      .setTimestamp();

    return embed;
  };
}

export default DayOne;