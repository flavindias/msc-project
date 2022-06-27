import dotenv from "dotenv";
import {
  Kafka,
  Consumer,
  Producer,
  Admin,
  Partitioners,
  ITopicConfig,
} from "kafkajs";
dotenv.config();
import { getRecommendation } from "./deezer";
const { KAFKA_BROKERS, KAFKA_TOPICS, KAFKA_SYNC_TOPICS } = process.env;

export class KafkaConnection {
  private kafka: Kafka;
  private consumer: Consumer;
  private producer: Producer;
  private admin: Admin;
  private static instance: KafkaConnection;

  constructor() {
    this.kafka = new Kafka({
      clientId: "my-app",
      brokers: `${KAFKA_BROKERS}`.split(","),
      connectionTimeout: 3000,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
    this.consumer = this.kafka.consumer({ groupId: `deejai-group` });
    this.admin = this.kafka.admin();
  }

  public static getInstance(): KafkaConnection {
    if (!KafkaConnection.instance) {
      KafkaConnection.instance = new KafkaConnection();
    }
    return KafkaConnection.instance;
  }

  public static getKafka(): Kafka {
    return KafkaConnection.getInstance().kafka;
  }

  async subscribe(): Promise<void> {
    try {
      `${KAFKA_TOPICS}`.split(",").forEach(async (topic) => {
        await this.consumer.subscribe({ topic, fromBeginning: true });
      });
    } catch (error) {
      console.error(error);
    }
  }

  async publish(topic: string, data: string): Promise<void> {
    try {
      await this.producer.connect();
      await this.producer.send({
        topic: topic,
        messages: [{ value: data }],
      });

      await this.producer.disconnect();
    } catch (error) {
      console.error(error);
    }
  }

  async run(): Promise<void> {
    try {
      await this.admin.connect();

      const topics: ITopicConfig[] = `${KAFKA_TOPICS},${KAFKA_SYNC_TOPICS}`
        .split(",")
        .map((topic) => {
          return {
            topic,
            numPartitions: 1,
            replicationFactor: 1,
          } as ITopicConfig;
        });

      await this.admin.createTopics({
        topics,
      });
      await this.producer.connect();
      await this.consumer.connect();
      await this.subscribe();
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          switch (topic) {
            case "deezer-login":
              const msg = message.value && JSON.parse(message.value.toString());
              await getRecommendation(msg.token, msg.userId);
              break;
            default:
              break;
          }
          // console.log({
          //   topic,
          //   partition,
          //   value: message.value?.toString(),
          // });
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
