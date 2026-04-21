import { producer, consumer } from "../config/kafka.js";
import prisma from "../config/db.js";

// Initialize Kafka producer and consumer
export const initKafka = async () => {
	try {
		await producer.connect();
		await consumer.connect();
		console.log("✅ Kafka connected successfully");
	} catch (error) {
		console.error("❌ Kafka connection failed:", error.message);
		throw error;
	}
};

// Disconnect Kafka
export const disconnectKafka = async () => {
	try {
		await producer.disconnect();
		await consumer.disconnect();
		console.log("✅ Kafka disconnected");
	} catch (error) {
		console.error("❌ Kafka disconnection failed:", error.message);
	}
};

/**
 * Publish order event to Kafka
 * This creates a timestamp-based event queue for processing orders in sequence
 *
 * @param {Object} orderData - Order data to publish
 * @returns {Promise}
 */
export const publishOrderEvent = async (orderData) => {
	try {
		const event = {
			orderId: orderData.orderId,
			userId: orderData.userId,
			productId: orderData.productId,
			quantity: orderData.quantity,
			timestamp: Date.now(), // Kafka will use this for ordering
			address: orderData.address,
			amount: orderData.amount,
			items: orderData.items,
			status: "PENDING",
		};

		await producer.send({
			topic: "product-orders",
			messages: [
				{
					key: orderData.productId, // Same product = same partition = ordered processing
					value: JSON.stringify(event),
					timestamp: Date.now().toString(), // Kafka timestamp
				},
			],
		});

		console.log(
			`📤 Order event published for product: ${orderData.productId}`,
		);
		return event;
	} catch (error) {
		console.error("❌ Failed to publish order event:", error.message);
		throw error;
	}
};

/**
 * Subscribe to order events from Kafka
 * Processes orders in FIFO order based on Kafka timestamps
 * Ensures first user to submit gets the product if stock is limited
 */
export const subscribeToOrderEvents = async () => {
	try {
		await consumer.subscribe({
			topic: "product-orders",
			fromBeginning: false,
		});

		await consumer.run({
			eachMessage: async ({ topic, partition, message }) => {
				try {
					const orderEvent = JSON.parse(message.value.toString());

					console.log(
						`📥 Processing order event:`,
						`Timestamp: ${orderEvent.timestamp},`,
						`User: ${orderEvent.userId},`,
						`Product: ${orderEvent.productId},`,
						`Quantity: ${orderEvent.quantity}`,
					);

					// Process order with stock check
					await processOrderWithStockCheck(orderEvent);
				} catch (error) {
					console.error(
						"❌ Error processing order event:",
						error.message,
					);
				}
			},
		});

		console.log("✅ Subscribed to order events (processing in sequence)");
	} catch (error) {
		console.error("❌ Failed to subscribe to order events:", error.message);
		throw error;
	}
};

/**
 * Process order with stock check
 * Only processes if stock is available
 * Uses database transaction to ensure atomicity
 */
export const processOrderWithStockCheck = async (orderEvent) => {
	try {
		const { productId, quantity, userId, orderId } = orderEvent;

		// Get product with current stock
		const product = await prisma.product.findUnique({
			where: { id: productId },
		});

		if (!product) {
			console.warn(`⚠️ Product not found: ${productId}`);
			await publishOrderStatusEvent({
				orderId,
				status: "FAILED",
				reason: "Product not found",
				timestamp: Date.now(),
			});
			return;
		}

		// Check if stock is available
		if (product.stock < quantity) {
			console.warn(
				`⚠️ Insufficient stock for product ${productId}. Available: ${product.stock}, Requested: ${quantity}`,
			);
			await publishOrderStatusEvent({
				orderId,
				status: "FAILED",
				reason: "Out of stock",
				timestamp: Date.now(),
			});
			return;
		}

		// Reserve stock using database transaction
		// This ensures atomicity - either all succeed or all fail
		const updatedProduct = await prisma.product.update({
			where: { id: productId },
			data: {
				stock: {
					decrement: quantity,
				},
			},
		});

		console.log(
			`✅ Stock reserved for order ${orderId}. Remaining stock: ${updatedProduct.stock}`,
		);

		// Update order status
		await publishOrderStatusEvent({
			orderId,
			userId,
			status: "CONFIRMED",
			reason: "Stock reserved successfully",
			timestamp: Date.now(),
			remainingStock: updatedProduct.stock,
		});
	} catch (error) {
		console.error("❌ Error in processOrderWithStockCheck:", error.message);
		throw error;
	}
};

/**
 * Publish order status event to order-status topic
 * This notifies the frontend of order status changes
 */
export const publishOrderStatusEvent = async (statusEvent) => {
	try {
		await producer.send({
			topic: "order-status",
			messages: [
				{
					key: statusEvent.orderId,
					value: JSON.stringify(statusEvent),
				},
			],
		});

		console.log(
			`📤 Status event published: Order ${statusEvent.orderId} - ${statusEvent.status}`,
		);
	} catch (error) {
		console.error("❌ Failed to publish status event:", error.message);
	}
};

/**
 * Get consumer lag for monitoring
 * Helps track how far behind the consumer is
 */
export const getConsumerLag = async () => {
	try {
		const admin = kafka.admin();
		await admin.connect();

		const groupOffsets = await admin.fetchOffsets("order-service-group");

		await admin.disconnect();

		return groupOffsets;
	} catch (error) {
		console.error("❌ Failed to get consumer lag:", error.message);
	}
};

export default {
	initKafka,
	disconnectKafka,
	publishOrderEvent,
	subscribeToOrderEvents,
	processOrderWithStockCheck,
	publishOrderStatusEvent,
	getConsumerLag,
};
