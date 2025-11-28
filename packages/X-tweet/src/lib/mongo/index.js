// src/lib/mongo/index.js
import { MongoClient } from 'mongodb';

let client;

export async function getMongoClient() {
  if (!client) {
    client = new MongoClient('mongodb://localhost:27017'); // replace with your MongoDB URI
    await client.connect();
    console.log('✅ Connected to MongoDB');
  }
  return client;
}
