import { Kafka } from "kafkajs";

const kafka = new Kafka({
	clientId: "lickhill-app",
	brokers: [process.env.KAFKA_BROKERS || "localhost:9092"],
	retry: {
		initialRetryTime: 100,
		retries: 8,
	},
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "order-service-group" });

export default kafka;
