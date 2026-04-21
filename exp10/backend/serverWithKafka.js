import express from "express";
import cors from "cors";
import "dotenv/config";
import {
	initKafka,
	subscribeToOrderEvents,
	disconnectKafka,
} from "./services/kafkaService.js";

// Import routes
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb" }));
app.use(cors());

// API Routes
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoutes);

// Health check
app.get("/health", (req, res) => {
	res.json({ status: "Server is running", timestamp: new Date() });
});

// Initialize Kafka and start server
const PORT = process.env.PORT || 4000;

const startServer = async () => {
	try {
		// Initialize Kafka
		console.log("🔄 Initializing Kafka...");
		await initKafka();

		// Subscribe to order events (Kafka consumer)
		console.log("📡 Subscribing to order events...");
		await subscribeToOrderEvents();

		// Start Express server
		app.listen(PORT, () => {
			console.log(`
╔════════════════════════════════════════╗
║   🚀 Lickhill Backend Server Running   ║
║                                        ║
║   URL: http://localhost:${PORT}      ║
║   Environment: ${process.env.NODE_ENV || "development"}         ║
║   Kafka: Connected ✅                 ║
╚════════════════════════════════════════╝
			`);
		});

		// Graceful shutdown
		process.on("SIGINT", async () => {
			console.log("\n⏹️  Shutting down gracefully...");
			await disconnectKafka();
			process.exit(0);
		});

		process.on("SIGTERM", async () => {
			console.log("\n⏹️  Shutting down gracefully...");
			await disconnectKafka();
			process.exit(0);
		});
	} catch (error) {
		console.error("❌ Failed to start server:", error.message);
		process.exit(1);
	}
};

startServer();

export default app;
