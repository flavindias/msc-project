import hpp from "hpp";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import express from "express";
import { deejaiRoutes } from "./routes";
import mongoSanitize from "express-mongo-sanitize";
import { KafkaConnection } from "./middlewares/kafka";
import { run as SpotifyWatcher } from "./middlewares/spotify";
import { run as DeezerWatcher } from "./middlewares/deezer";

dotenv.config();

const { API_PORT } = process.env;

const app = express();
app.use(hpp());
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "1kb" }));
app.use(
  mongoSanitize({
    onSanitize: ({ req, key }) => {
      console.warn(`This request[${key}] is sanitized`, req);
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: "1kb" }));

app.use("/api", deejaiRoutes());

const kafka: KafkaConnection = new KafkaConnection();
kafka.run();
SpotifyWatcher();
DeezerWatcher();
app.listen(API_PORT, () => {
  console.log(`API listening on port ${API_PORT}`);
});
