import { MongoClient, ServerApiVersion } from 'mongodb';
import { config } from 'dotenv';

class Db {
  constructor() {
    config();
    this.uri = process.env.DB;
    this.client = new MongoClient(this.uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }

  async connectToDatabase() {
    try {
      await this.client.connect();
      console.log('Connected to MongoDB Atlas');
      return this.client;
    } catch (error) {
      console.error('Error connecting to MongoDB Atlas:', error);
      throw error;
    }
  }

  async getScores(scoreType, message) {
    const userId = process.env.ID;
    const database = this.client.db(process.env.DB_NAME);
    const collection = database.collection(process.env.COLLECTION_NAME);

    try {
      const filter = { userId: userId };
      const userDocument = await collection.findOne(filter);

      if (userDocument) {
        const currentScore = userDocument[scoreType] || 0;
        const newScore = currentScore + 1;

        await collection.updateOne(filter, { $set: { [scoreType]: newScore } });

        const opponentScoreType = scoreType === 'dj' ? 'p' : 'dj';
        const name = scoreType === 'dj' ? 'DJ_SweatLord' : 'p-slim';
        const opponentName = scoreType === 'dj' ? 'p-slim' : 'DJ_SweatLord';
        const opponentScore = userDocument[opponentScoreType] || 0;

        return message.channel.send(`${name} takes home win #${newScore}!\n` + 
        `Record against ${opponentName} is now ${newScore}-${opponentScore}.`);
      } else {
        throw new Error(`User with ID ${userId} not found.`);
      }
    } catch (error) {
      console.error(`Error updating ${scoreType} score:`, error);
      throw error;
    }
  }
}

export default new Db();