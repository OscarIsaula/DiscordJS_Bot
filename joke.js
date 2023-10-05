const axios = require('axios');

const JOKE_API_BASE_URL = 'https://v2.jokeapi.dev/joke/';

class Joke {
  constructor() {
    this.categories = 'Programming,Miscellaneous,Christmas';
    this.apiUrl = JOKE_API_BASE_URL + this.categories;
  }

  async getRandomJoke() {
    try {
      const response = await axios.get(this.apiUrl);
      return this.parseApiResponse(response.data);
    } catch (error) {
      console.error('Error fetching joke:', error.message);
      return 'Error: Unable to fetch a joke from the JokeAPI.';
    }
  }

  parseApiResponse = (responseBody) => {
    try {
      const jsonObject = responseBody;

      if (jsonObject.type === 'single') {
        return jsonObject.joke;
      } else if (jsonObject.type === 'twopart') {
        return `${jsonObject.setup}\n${jsonObject.delivery}`;
      } else {
        return 'Error: Unable to parse the joke from the JokeAPI response.';
      }
    } catch (error) {
      console.error('Error parsing API response:', error.message);
      return 'Error: Unable to parse the joke from the JokeAPI response.';
    }
  };
}

module.exports = Joke;
