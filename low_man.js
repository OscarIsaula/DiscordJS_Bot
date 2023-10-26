import { config } from 'dotenv';
import axios from 'axios';
import { EmbedBuilder } from 'discord.js';
import { raids } from './raid.js';


class LowMan {
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
    this.report = new Set();
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
    const raidList = Object.values(raids);

    for (let i = 0; i < activities.length; i++) {
      const activity = activities[i];
      const activityHash = activity.activityDetails.referenceId;

      raidList
        .filter((raid) => raid !== null && activityHash.toString() === raid.hash)
        .forEach((raid) => this.getInstanceIds(activity, raid, message));
    }
  };

  getInstanceIds(activity, raid, message) {
    const values = activity.values;
    const completedValue = values.completed.basic.value;
    const playerCount = values.playerCount.basic.value;

    if (completedValue === 1.0 && playerCount <= 9.0) {
      const instanceId = activity.activityDetails.instanceId.toString();
      this.pgcrEndpoint(instanceId, raid, message);
    }
  }

  pgcrEndpoint = (instanceId, raid, message) => {
    const pgcrEndpointURL = `/Destiny2/Stats/PostGameCarnageReport/${instanceId}/`;

    const statsWebClient = axios.create({
      baseURL: 'https://stats.bungie.net/Platform',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.KEY,
      },
    });

    statsWebClient.get(pgcrEndpointURL)
      .then((response) => {
        this.isLowMan(response.data, raid, instanceId, message);
      })
      .catch((error) => {
        console.error('Error accessing Bungie API: ' + error.message);
      });
  };

  isLowMan = (responseBody, raid, instanceId, message) => {
    const responseData = responseBody.Response;
    const entries = responseData.entries;
    const accountCount = new Set();
    let totalDeaths = 0.0;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const bungieGlobalDisplayName = entry.player.destinyUserInfo.bungieGlobalDisplayName;
      const playerDeaths = entry.values.deaths.basic.value;
      totalDeaths += playerDeaths;
      accountCount.add(bungieGlobalDisplayName);
    }

    if (accountCount.size <= 3) {
      const playerCount = accountCount.size;
      this.raidTags(playerCount, responseData, totalDeaths, raid, instanceId, message);
    }
  };

  raidTags = (playerCount, responseData, totalDeaths, raid, instanceId, message) => {
    const lowmanCategory = this.getLowmanCategory(playerCount);
    const flawlessStatus = this.isFlawless(totalDeaths);
    const fresh = this.isFresh(responseData);

    const entry = lowmanCategory + flawlessStatus + fresh + raid.name;
    this.addToReport(entry, instanceId, message);
  };

  getLowmanCategory = (playerCount) => {
    return playerCount === 2 ? "Duo " : playerCount === 3 ? "Trio " : "Solo ";
  };

  isFlawless = (totalDeaths) => {
    return totalDeaths === 0 ? "Flawless " : "";
  };

  isFresh = (responseData) => {
    const isFresh = responseData.activityWasStartedFromBeginning;
    return isFresh ? "Fresh " : "Checkpoint ";
  };

  addToReport = async (entry, instanceId, message) => {
    if (!this.report.has(entry)) {
      this.report.add(entry);
      const finalEntry = `[${entry}](https://raid.report/pgcr/${instanceId})`;

      const embed = this.buildLowManEmbed(finalEntry);
      try {
        await message.channel.send({ embeds: [embed] });
      } catch (error) {
        console.error('Error sending message:', error.message);
      }
    }
  };

  buildLowManEmbed = (results) => {
    const embed = new EmbedBuilder()
      .setColor('#FF6464')
      .setDescription(results)
      .setTimestamp();

    return embed;
  };
}

export default LowMan;