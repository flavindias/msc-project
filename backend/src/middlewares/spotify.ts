import axios from "axios";
import dotenv from "dotenv";
import { Kafka } from "kafkajs";
dotenv.config()

const { KAFKA_BROKERS } = process.env;
const kafka = new Kafka({
    clientId: "deejai-consumer",
    brokers: `${KAFKA_BROKERS}`.split(",")
});
const consumer = kafka.consumer({ groupId: 'spotify-group' });
const producer = kafka.producer();
export const getTrackInfo = async () => {
    try {
        console.log('getTrackInfo');
        const data = await axios.get(`https://api.spotify.com/v1/me/top/tracks`);
        console.log(data.data);
    }
    catch (error) {
        console.log(error);
    }
};
export const getArtistInfo = () => {
    console.log('getArtistInfo');
};
export const getAudioFeatures = () => {
    console.log('getAudioFeatures');
};
export const run = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            value: message.value && message.value.toString(),
          })
        },
      })
}