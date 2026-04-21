import axios from "axios";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM || "noreply@lickhill.com";
const FROM_NAME = "LickHill Store";

// Function to send order confirmation email
const sendOrderConfirmationEmail = async (email, orderDetails) => {
	try {
		// Parse items if it's a string
		let items = orderDetails.items;
		if (typeof items === "string") {
			items = JSON.parse(items);
		}

		// Parse address if it's a string
		let address = orderDetails.address;
		if (typeof address === "string") {
			address = JSON.parse(address);
		}

		// Convert BigInt date to number for Date constructor
		const dateValue =
			typeof orderDetails.date === "bigint"
				? Number(orderDetails.date)
				: orderDetails.date;
		const orderDate = new Date(dateValue).toLocaleDateString("en-IN");

		// Create order items HTML
		const itemsHTML = items
			.map(
				(item) => `
			<tr>
				<td style="padding: 12px; border-bottom: 1px solid #ddd;">${item.name}</td>
				<td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
				<td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price}</td>
				<td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price * item.quantity}</td>
			</tr>
		`,
			)
			.join("");

		const mailOptions = {
			from: FROM_EMAIL,
			to: email,
			subject: "Order Confirmation - Scalar AI Ecom - LickHIll",
			html: `
				<!DOCTYPE html>
				<html>
				<head>
					<style>
						body {
							font-family: Arial, sans-serif;
							line-height: 1.6;
							color: #333;
						}
						.container {
							max-width: 600px;
							margin: 0 auto;
							padding: 20px;
							background-color: #f9f9f9;
						}
						.header {
							background-color: #000;
							color: white;
							padding: 20px;
							text-align: center;
							border-radius: 5px 5px 0 0;
						}
						.header h1 {
							margin: 0;
							font-size: 28px;
						}
						.content {
							background-color: white;
							padding: 20px;
							border-radius: 0 0 5px 5px;
						}
						.order-info {
							background-color: #f0f0f0;
							padding: 15px;
							border-radius: 5px;
							margin: 20px 0;
						}
						.order-info p {
							margin: 8px 0;
							font-size: 14px;
						}
						.order-info strong {
							color: #000;
						}
						table {
							width: 100%;
							border-collapse: collapse;
							margin: 20px 0;
						}
						table th {
							background-color: #333;
							color: white;
							padding: 12px;
							text-align: left;
						}
						.total-row {
							font-weight: bold;
							font-size: 16px;
							background-color: #f0f0f0;
						}
						.total-row td {
							padding: 12px;
						}
						.delivery-address {
							background-color: #e8f5e9;
							padding: 15px;
							border-radius: 5px;
							margin: 20px 0;
						}
						.footer {
							background-color: #333;
							color: white;
							padding: 15px;
							text-align: center;
							font-size: 12px;
							border-radius: 0 0 5px 5px;
						}
						.btn {
							display: inline-block;
							background-color: #ffc107;
							color: #000;
							padding: 12px 30px;
							text-decoration: none;
							border-radius: 5px;
							font-weight: bold;
							margin-top: 15px;
						}
					</style>
				</head>
				<body>
					<div class="container">
						<div class="header">
							<h1>🎉 Order Confirmed!</h1>
						</div>
						<div class="content">
							<p>Dear Customer,</p>
							<p>Thank you for your order! We're excited to get your items ready for shipment.</p>
							
							<div class="order-info">
								<p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
								<p><strong>Order Date:</strong> ${orderDate}</p>
								<p><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>
								<p><strong>Order Status:</strong> ${orderDetails.status}</p>
							</div>

							<h3 style="margin-top: 20px;">Order Summary</h3>
							<table>
								<thead>
									<tr>
										<th>Product</th>
										<th>Quantity</th>
										<th>Price</th>
										<th>Total</th>
									</tr>
								</thead>
								<tbody>
									${itemsHTML}
									<tr class="total-row">
										<td colspan="3" style="text-align: right;">Total Amount:</td>
										<td style="text-align: right;">₹${orderDetails.amount}</td>
									</tr>
								</tbody>
							</table>

							<div class="delivery-address">
								<h3 style="margin-top: 0;">📦 Delivery Address</h3>
								<p><strong>${address.firstName} ${address.lastName}</strong></p>
								<p>${address.street}</p>
								<p>${address.city}, ${address.state} - ${address.zipcode}</p>
								<p><strong>Phone:</strong> ${address.phone}</p>
								<p><strong>Email:</strong> ${address.email}</p>
							</div>

							<p style="color: #666; font-size: 14px;">
								<strong>What's next?</strong><br>
								Your order will be processed and shipped within 2-3 business days. You'll receive a tracking number via email once it's shipped.
							</p>

							<div style="text-align: center;">
								<a href="${process.env.FRONTEND_URL}/orders" class="btn">Track Your Order</a>
							</div>

							<p style="margin-top: 30px; color: #666; font-size: 12px;">
								If you have any questions about your order, please don't hesitate to contact us.
							</p>
						</div>
						<div class="footer">
							<p>&copy; 2026 LickHill. All rights reserved.</p>
							<p>Thank you for shopping with us!</p>
						</div>
					</div>
				</body>
				</html>
			`,
		};

		const result = await axios.post(
			"https://api.brevo.com/v3/smtp/email",
			{
				sender: {
					name: FROM_NAME,
					email: FROM_EMAIL,
				},
				to: [
					{
						email: mailOptions.to,
					},
				],
				subject: mailOptions.subject,
				htmlContent: mailOptions.html,
			},
			{
				headers: {
					"api-key": BREVO_API_KEY,
					"Content-Type": "application/json",
				},
			},
		);

		if (!result.data?.messageId) {
			console.error("Error sending email:", result.data);
			return false;
		}

		console.log("Order confirmation email sent to:", email);
		return true;
	} catch (error) {
		console.error("Error sending email:", error);
		return false;
	}
};

export { sendOrderConfirmationEmail };
