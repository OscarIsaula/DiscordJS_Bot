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

  connectToDatabase = async () => {
    try {
      await this.client.connect();
      console.log('Connected to MongoDB Atlas');
      return this.client;
    } catch (error) {
      console.error('Error connecting to MongoDB Atlas:', error);
      throw error;
    }
  };

  getScores = async (command, scoreType, message) => {
    const userId = process.env.ID;
    const database = this.client.db(process.env.DB_NAME);
    const collection = database.collection(process.env.COLLECTION_NAME);
    const id = message.author.id;
  
    try {
      // 👇 Block specific user from +dj
      if (String(id) === "650854433353236511" && command === "+" && scoreType === "dj") {
        await message.channel.send("Nice Try");
        return; // ⬅️ this prevents the rest of the code from running
      }
  
      const filter = { userId: userId };
      const userDocument = await collection.findOne(filter);
  
      if (userDocument) {
        const currentScore = userDocument[scoreType] || 0;
        const newScore = command === "+" ? currentScore + 1 : currentScore - 1;
        const text =
          command === "+"
            ? " takes home win #"
            : " takes an L. Win count is down to ";
  
        await collection.updateOne(filter, { $set: { [scoreType]: newScore } });
  
        const opponentScoreType = scoreType === "dj" ? "p" : "dj";
        const name = scoreType === "dj" ? "DJSkips_a_beat" : "LegendaryDopeBoi";
        const opponentName =
          scoreType === "dj" ? "LegendaryDopeBoi" : "DJSkips_a_beat";
        const opponentScore = userDocument[opponentScoreType] || 0;
  
        return message.channel.send(
          `${name}${text}${newScore}!\n` +
            `Record against ${opponentName} is now ${newScore}-${opponentScore}.`
        );
      } else {
        throw new Error(`User with ID ${userId} not found.`);
      }
    } catch (error) {
      console.error(`Error updating ${scoreType} score:`, error);
      throw error;
    }
  };
  
}

export default new Db();