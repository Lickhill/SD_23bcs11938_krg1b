import prisma from "../config/db.js";
import { publishOrderEvent } from "../services/kafkaService.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Place order endpoint
 * 1. Creates order record with PENDING status
 * 2. Publishes order event to Kafka queue
 * 3. Kafka consumer processes in FIFO order based on timestamps
 * 4. Stock is reserved by the consumer if available
 */
const placeOrder = async (req, res) => {
	try {
		const { items, address, amount } = req.body;
		const userId = req.body.userId || req.user.id;

		if (!items || items.length === 0) {
			return res.json({
				success: false,
				message: "Order items cannot be empty",
			});
		}

		if (!address) {
			return res.json({
				success: false,
				message: "Delivery address is required",
			});
		}

		// Generate unique order ID
		const orderId = `ORD-${uuidv4().substring(0, 8).toUpperCase()}`;

		// Step 1: Create order in database with PENDING status
		const order = await prisma.order.create({
			data: {
				id: orderId,
				userId,
				items: JSON.stringify(items),
				address: JSON.stringify(address),
				amount,
				status: "PENDING", // Initially pending, will be updated by Kafka consumer
				paymentMethod: "COD",
				payment: false,
				date: BigInt(Date.now()),
			},
		});

		console.log(`📝 Order created: ${orderId}`);

		// Step 2: Publish order event to Kafka
		// The timestamp in Kafka will determine processing order
		try {
			await publishOrderEvent({
				orderId,
				userId,
				items,
				address,
				amount,
				productId: items[0]?.id || "unknown", // Use first product as partition key
				quantity: items[0]?.quantity || 1,
			});

			console.log(`✅ Order ${orderId} sent to Kafka queue`);

			return res.json({
				success: true,
				message: "Order placed successfully! Processing your order...",
				orderId,
				status: "PENDING",
			});
		} catch (kafkaError) {
			// If Kafka fails, still keep the order but mark it
			console.error(
				"⚠️ Kafka publish failed, but order created:",
				kafkaError.message,
			);

			return res.json({
				success: true,
				message:
					"Order created but may need manual processing. Please check status soon.",
				orderId,
				status: "PENDING_MANUAL",
				warning: "Kafka queue temporarily unavailable",
			});
		}
	} catch (error) {
		console.error("❌ Error placing order:", error);
		res.json({ success: false, message: error.message });
	}
};

/**
 * Get user orders
 * Returns all orders for the logged-in user with their current status
 */
const userOrders = async (req, res) => {
	try {
		const userId = req.body.userId || req.user.id;

		const orders = await prisma.order.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
		});

		// Parse JSON fields for response
		const formattedOrders = orders.map((order) => ({
			...order,
			items: JSON.parse(order.items || "[]"),
			address: JSON.parse(order.address || "{}"),
		}));

		res.json({ success: true, orders: formattedOrders });
	} catch (error) {
		console.error("❌ Error fetching orders:", error);
		res.json({ success: false, message: error.message });
	}
};

/**
 * Get all orders (Admin)
 * Returns all orders with detailed information
 */
const allOrders = async (req, res) => {
	try {
		const orders = await prisma.order.findMany({
			orderBy: { createdAt: "desc" },
		});

		// Parse JSON fields
		const formattedOrders = orders.map((order) => ({
			...order,
			items: JSON.parse(order.items || "[]"),
			address: JSON.parse(order.address || "{}"),
		}));

		res.json({ success: true, orders: formattedOrders });
	} catch (error) {
		console.error("❌ Error fetching all orders:", error);
		res.json({ success: false, message: error.message });
	}
};

/**
 * Update order status (Admin)
 * Admin can manually update order status
 */
const updateOrderStatus = async (req, res) => {
	try {
		const { orderId, status } = req.body;

		const validStatuses = [
			"Order Placed",
			"Processing",
			"Shipped",
			"Delivered",
			"Cancelled",
		];

		if (!validStatuses.includes(status)) {
			return res.json({
				success: false,
				message: "Invalid status",
			});
		}

		const updatedOrder = await prisma.order.update({
			where: { id: orderId },
			data: { status },
		});

		console.log(`✅ Order ${orderId} status updated to: ${status}`);

		res.json({
			success: true,
			message: "Order status updated",
			order: updatedOrder,
		});
	} catch (error) {
		console.error("❌ Error updating order status:", error);
		res.json({ success: false, message: error.message });
	}
};

export { placeOrder, userOrders, allOrders, updateOrderStatus };
