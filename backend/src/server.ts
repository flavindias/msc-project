import hpp from 'hpp';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import express from 'express';
dotenv.config();

const { API_PORT } = process.env;

const app = express();
app.use(hpp());
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "1kb" }));
app.use(express.urlencoded({ extended: true, limit: "1kb" }));
 
app.get("/", function (_, res) {
  res.send("Deej.ai API");
});
 
app.listen(API_PORT, () => {
  console.log(`API listening on port ${API_PORT}`);
  });