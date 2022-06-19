import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import Logger from "./logger";

dotenv.config();

const { MONGO_DB_NAME, MONGO_DB_URL } = process.env;

const db = new MongoClient(`${MONGO_DB_URL}`);

db.connect(async (err) => {
  if (err) {
    Logger.error(err);
    throw err;
  }
  Logger.info("Connected to database");
});

db.db(MONGO_DB_NAME)
  .collection("deezerTokens")
  .createIndex({ "createdAt": 1 }, { expireAfterSeconds: 86400 }); // 24 hours
db.db(MONGO_DB_NAME)
  .collection("spotifyTokens")
  .createIndex({ "createdAt": 1 }, { expireAfterSeconds: 3600 }); // 1 hour

export default db.db(MONGO_DB_NAME);
