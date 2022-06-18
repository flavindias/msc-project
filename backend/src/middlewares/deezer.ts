
import dotenv from "dotenv";
import { Kafka } from "kafkajs";
dotenv.config()

const { KAFKA_BROKERS } = process.env;
const kafka = new Kafka({
    clientId: "deejai-deezer-consumer",
    brokers: `${KAFKA_BROKERS}`.split(",")
});
const consumer = kafka.consumer({ groupId: 'deezer-group' });

export const getTrackInfo = () => {
    console.log('getTrackInfo');
};
export const getArtistInfo = () => {
    console.log('getArtistInfo');
};