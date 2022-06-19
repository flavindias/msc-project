import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import Logger from "./logger";

dotenv.config();

const { DB_NAME, DB_URL } = process.env;

const dbUrl = `${DB_URL}`;
const db = new MongoClient(dbUrl);

db.connect(async (err) => {
  if (err) {
    Logger.error(err);
    throw err;
  }
  Logger.info("Connected to database");
});

export default db.db(DB_NAME);