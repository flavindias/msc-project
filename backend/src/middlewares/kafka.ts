import dotenv from 'dotenv';
import { Kafka, Consumer, Producer, logLevel } from "kafkajs";
dotenv.config();

const { KAFKA_BROKERS } = process.env;

export class KafkaConnection {
  private kafka: Kafka;
  private consumer: Consumer;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: "kafka-client",
      brokers: `${KAFKA_BROKERS}`.split(","),
      logLevel: logLevel.INFO,
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: `deejai-group` });
  }

  async subscribe(topics: string[]): Promise<void> {
    try {
      topics.forEach(async topic => {
          await this.consumer.stop();
          await this.consumer.subscribe({ topic, fromBeginning: false });
      });
      const resumeList = topics.map(topic => { return { topic }; });
      await this.consumer.resume(resumeList);
    } catch (error) {
      console.error(error);
    }
  }

  async produce(topic: string, data: string): Promise<void> {
    try {
      await this.producer.connect();
      const resp = await this.producer.send({
        topic,
        timeout: 2,
        messages: [
          {
            key: `key-${Math.random().toString(36).substring(7)}`,
            value: data,
          },
        ],
      });
      if (resp) {
        console.log(resp, "data has been sent");
        // return { resp, topic, data };
      }
    } catch (error) {
      console.error(error);
    }
  }

  async consume(): Promise<void> {
    try {
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            topic,
            partition,
            value: message.value?.toString(),
          });
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}