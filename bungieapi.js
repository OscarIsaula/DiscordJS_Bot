require('dotenv').config();
const DayOne = require('./dayone.js');
const LowMan = require('./lowman.js');
const axios = require('axios');

const day = new DayOne();
const low = new LowMan();
class BungieApi {
  constructor() {
    this.bungieWebClient = axios.create({
      baseURL: 'https://www.bungie.net/Platform',
      headers: {
        'X-API-Key': process.env.KEY,
        'Content-Type': 'application/json',
      },
    });
  }

  async getMembershipInfo(bungieId, command, message) {
    const encodedBungieId = encodeURIComponent(bungieId);
    
    const searchDestinyPlayer = `/Destiny2/SearchDestinyPlayer/-1/${encodedBungieId}`;
    console.log('Bungie ID:', bungieId);
  
    try {
      const response = await this.bungieWebClient.get(searchDestinyPlayer);
      const responseBody = response.data;
      this.parseMembershipInfo(responseBody, command, message);
    } catch (error) {
      console.error('Error accessing Bungie API:', error.message);
    }
  }

  parseMembershipInfo = (responseBody, command, message) => {
    const responseData = responseBody.Response[0];
    const membershipType = responseData.membershipType.toString();
    const membershipId = responseData.membershipId;
    this.getProfileData(membershipType, membershipId, command, message);
  };

  async getProfileData(membershipType, membershipId, command, message) {
    const searchProfile = `/Destiny2/${membershipType}/Profile/${membershipId}/`;
    const params = { components: '200' };

    try {
      const response = await this.bungieWebClient.get(searchProfile, { params });
      const responseBody = response.data;
      this.parseProfileData(responseBody, membershipType, membershipId, command, message);
    } catch (error) {
      console.error('Error accessing Bungie API for profile data:', error.message);
    }
  }

  parseProfileData = (responseBody, membershipType, membershipId, command, message) => {
    const charactersData = responseBody.Response.characters.data;
    const characterIds = Object.keys(charactersData);
    
    console.log('Membership Type:', membershipType);
    console.log('Membership ID:', membershipId);
    console.log('Character IDs:', characterIds);

    if (command === 'day1') {
      day.getActivityHistory(characterIds, membershipType, membershipId, message);
    } else if (command === 'lowman') {
      low.getActivityHistory(characterIds, membershipType, membershipId, message);
    }
  };
}

module.exports = BungieApi;