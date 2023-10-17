import { MongoClient, ServerApiVersion } from 'mongodb';
import { config } from 'dotenv';

config();

class Db {
  constructor() {
    this.uri = process.env.DB;
    this.client = new MongoClient(this.uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    this.databaseName = process.env.DB_NAME;
    this.collectionName = process.env.COLLECTION_NAME;
}

async connectToDatabase() {
  try {
      await this.client.connect();
      console.log("Connected to MongoDB Atlas");
      return this.client;
    } catch (error) {
      console.error("Error connecting to MongoDB Atlas:", error);
      throw error;
    }
  }
  // +dj Command Logic
  async incrementDjScore(userId) {
    const database = this.client.db(this.databaseName);
    const collection = database.collection(this.collectionName);
    
    try {
      const filter = { userId: userId };
      const userDocument = await collection.findOne(filter);
      
      if (userDocument) {
        const currentDjScore = userDocument.dj || 0;
        const newDjScore = currentDjScore + 1;
        
        await collection.updateOne(filter, { $set: { dj: newDjScore } });
        return newDjScore;
      } else {
        throw new Error(`User with ID ${userId} not found.`);
      }
    } catch (error) {
      console.error("Error updating DJ score:", error);
      throw error;
    }
  }

  // +p Command Logic
  async incrementPScore(userId) {
    const database = this.client.db(this.databaseName);
    const collection = database.collection(this.collectionName);
    
    try {
      const filter = { userId: userId };
      const userDocument = await collection.findOne(filter);
      
      if (userDocument) {
        const currentPScore = userDocument.p || 0;
        const newPScore = currentPScore + 1;
        
        await collection.updateOne(filter, { $set: { p: newPScore } });
        return newPScore;
      } else {
        throw new Error(`User with ID ${userId} not found.`);
      }
    } catch (error) {
      console.error("Error updating P score:", error);
      throw error;
    }
  }
  // +dj Command Logic
async getDjScore(userId) {
    const database = this.client.db(this.databaseName);
    const collection = database.collection(this.collectionName);
  
    try {
      const filter = { userId: userId };
      const userDocument = await collection.findOne(filter);
  
      if (userDocument) {
        const djScore = userDocument.dj || 0;
        return djScore;
      } else {
        throw new Error(`User with ID ${userId} not found.`);
      }
    } catch (error) {
      console.error("Error getting DJ score:", error);
      throw error;
    }
  }
  
  // +p Command Logic
  async getPScore(userId) {
    const database = this.client.db(this.databaseName);
    const collection = database.collection(this.collectionName);
  
    try {
      const filter = { userId: userId };
      const userDocument = await collection.findOne(filter);
  
      if (userDocument) {
        const pScore = userDocument.p || 0;
        return pScore;
      } else {
        throw new Error(`User with ID ${userId} not found.`);
      }
    } catch (error) {
      console.error("Error getting P score:", error);
      throw error;
    }
  }
}

export default new Db();
