import prisma from "../config/db.js";
import { sendOrderConfirmationEmail } from "../config/email.js";

//global variables
const currency = "INR";
const deliveryCharge = 0;

// placing orders using COD method
const placeOrder = async (req, res) => {
	try {
		const { userId, items, amount, address } = req.body;

		const orderData = {
			userId,
			items,
			address,
			amount,
			paymentMethod: "COD",
			payment: false,
			date: Date.now(),
		};

		const newOrder = await prisma.order.create({
			data: orderData,
		});

		// Decrement stock for each item in the order
		let itemsArray = items;

		// Parse items if it's a string
		if (typeof itemsArray === "string") {
			itemsArray = JSON.parse(itemsArray);
		}

		if (Array.isArray(itemsArray) && itemsArray.length > 0) {
			for (const item of itemsArray) {
				try {
					await prisma.product.update({
						where: { id: item._id },
						data: {
							stock: {
								decrement: item.quantity,
							},
						},
					});
				} catch (updateError) {
					console.error(
						`Error updating stock for product ${item._id}:`,
						updateError.message,
					);
				}
			}
		}

		await prisma.user.update({
			where: { id: userId },
			data: { cartData: {} },
		});

		// Parse address to get email
		let addressData = address;
		if (typeof addressData === "string") {
			addressData = JSON.parse(addressData);
		}

		// Send order confirmation email
		if (addressData.email) {
			await sendOrderConfirmationEmail(addressData.email, {
				orderId: newOrder.id,
				items: itemsArray,
				amount,
				address: addressData,
				paymentMethod: "COD",
				status: "Order Placed",
				date: newOrder.date,
			});
		}

		res.json({ success: true, message: "Order Placed" });
	} catch (error) {
		console.error("PlaceOrder error:", error);
		res.json({ success: false, message: error.message });
	}
};

//All orders data for admin panel
const allOrders = async (req, res) => {
	try {
		const orders = await prisma.order.findMany();
		// Convert BigInt to string for JSON serialization
		const ordersFormatted = orders.map((order) => ({
			...order,
			date: order.date.toString(),
		}));
		res.json({ success: true, orders: ordersFormatted });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

//User order data for frontend
const userOrders = async (req, res) => {
	try {
		const { userId } = req.body;

		const orders = await prisma.order.findMany({
			where: { userId },
		});
		// Convert BigInt to string for JSON serialization
		const ordersFormatted = orders.map((order) => ({
			...order,
			date: order.date.toString(),
		}));
		res.json({ success: true, orders: ordersFormatted });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

//update order status from admin panel
const updateStatus = async (req, res) => {
	try {
		const { orderId, status } = req.body;

		await prisma.order.update({
			where: { id: orderId },
			data: { status },
		});
		res.json({ success: true, message: "Status Udated" });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export { placeOrder, allOrders, userOrders, updateStatus };
