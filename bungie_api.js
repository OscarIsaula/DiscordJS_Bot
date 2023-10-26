import { config } from 'dotenv';
import axios from 'axios';
import DayOne from './day_one.js';
import LowMan from './low_man.js';

class BungieApi {
  constructor() {
    config();
    this.bungieWebClient = axios.create({
      baseURL: 'https://www.bungie.net/Platform',
      headers: {
        'X-API-Key': process.env.KEY,
        'Content-Type': 'application/json',
      },
    });
    this.dayOne = new DayOne();
    this.lowMan = new LowMan();
  }

  async getMembershipInfo(bungieId, command, message) {
    try {
      const playerInfo = await this.searchDestinyPlayer(bungieId, message);
      if (playerInfo) {
        const { membershipType, membershipId } = playerInfo;
        this.getProfileData(membershipType, membershipId, command, message);
      }
    } catch (error) {
      console.error('Error accessing Bungie API:', error.message);
    }
  }

  async searchDestinyPlayer(bungieId, message) {
    const encodedBungieId = encodeURIComponent(bungieId);
    const searchDestinyPlayer = `/Destiny2/SearchDestinyPlayer/-1/${encodedBungieId}`;
    
    try {
      const response = await this.bungieWebClient.get(searchDestinyPlayer);
      const responseData = response.data.Response[0];
      return {
        membershipType: responseData.membershipType.toString(),
        membershipId: responseData.membershipId,
      };
    } catch (error) {
      console.error('Error searching Destiny player:', error.message);
      if (message) {
        message.channel.send(`Error searching Destiny player: ${error.message}\nPlease ensure ` + 
        `proper spelling for command/BungieID with exactly 1 space in between (ex: !day1 Aegis#8706).`);
      }
      return null;
    }
  }

  async getProfileData(membershipType, membershipId, command, message) {
    const searchProfile = `/Destiny2/${membershipType}/Profile/${membershipId}/`;
    const params = { components: '200' };
    
    try {
      const response = await this.bungieWebClient.get(searchProfile, { params });
      const charactersData = response.data.Response.characters.data;
      const characterIds = Object.keys(charactersData);

      if (command === 'day1') {
        this.dayOne.getActivityHistory(characterIds, membershipType, membershipId, message);
        return;
      }
      this.lowMan.getActivityHistory(characterIds, membershipType, membershipId, message);
    } catch (error) {
      console.error('Error accessing Bungie API for profile data:', error.message);
    }
  }
}

export default BungieApi;