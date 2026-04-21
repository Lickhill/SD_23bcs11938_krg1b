import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
	"For You",
	"Fashion",
	"Mobiles",
	"Beauty",
	"Electronics",
	"Home",
	"Appliances",
	"Toys, Baby & More",
	"Food & Health",
	"Auto Accessories",
	"2 Wheelers",
	"Sports & Outdoors",
	"Books & More",
	"Furniture",
];

const subcategories = ["Standard", "Premium", "Budget", "Luxury", "Basic"];

const sizes = ["S", "M", "L", "XL", "XXL"];

const imageMap = {
	"For You": [
		"https://images.unsplash.com/photo-1512499617640-c2f999098c01",
		"https://images.unsplash.com/photo-1523275335684-37898b6baf30",
	],
	Fashion: [
		"https://images.unsplash.com/photo-1521334884684-d80222895322",
		"https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
	],
	Mobiles: [
		"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
		"https://images.unsplash.com/photo-1580910051074-3eb694886505",
	],
	Beauty: [
		"https://images.unsplash.com/photo-1596462502278-27bfdc403348",
		"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
	],
	Electronics: [
		"https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
		"https://images.unsplash.com/photo-1518770660439-4636190af475",
	],
	Home: [
		"https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
		"https://images.unsplash.com/photo-1493666438817-866a91353ca9",
	],
	Appliances: [
		"https://images.unsplash.com/photo-1586201375761-83865001e31c",
		"https://images.unsplash.com/photo-1574269909862-7e1d70bb8078",
	],
	"Toys, Baby & More": [
		"https://images.unsplash.com/photo-1587654780291-39c9404d746b",
		"https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
	],
	Toys: [
		"https://images.unsplash.com/photo-1587654780291-39c9404d746b",
		"https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
	],
	"Food & Health": [
		"https://images.unsplash.com/photo-1490645935967-10de6ba17061",
		"https://images.unsplash.com/photo-1504674900247-0877df9cc836",
	],
	Food: [
		"https://images.unsplash.com/photo-1490645935967-10de6ba17061",
		"https://images.unsplash.com/photo-1504674900247-0877df9cc836",
	],
	"Auto Accessories": [
		"https://images.unsplash.com/photo-1503376780353-7e6692767b70",
		"https://images.unsplash.com/photo-1487754180451-c456f719a1fc",
	],
	"2 Wheelers": [
		"https://images.unsplash.com/photo-1558980664-10ea1b3e5c8b",
		"https://images.unsplash.com/photo-1518655048521-f130df041f66",
	],
	"Sports & Outdoors": [
		"https://images.unsplash.com/photo-1517649763962-0c623066013b",
		"https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf",
	],
	Sports: [
		"https://images.unsplash.com/photo-1517649763962-0c623066013b",
		"https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf",
	],
	"Books & More": [
		"https://images.unsplash.com/photo-1512820790803-83ca734da794",
		"https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
	],
	Books: [
		"https://images.unsplash.com/photo-1512820790803-83ca734da794",
		"https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
	],
	Furniture: [
		"https://images.unsplash.com/photo-1505691938895-1758d7feb511",
		"https://images.unsplash.com/photo-1493663284031-b7e3aaa4cab7",
	],
};

function randomPrice() {
	return Math.floor(Math.random() * 5000) + 500;
}

function randomStock() {
	return Math.floor(Math.random() * 100) + 1;
}

function randomSubcategory() {
	return subcategories[Math.floor(Math.random() * subcategories.length)];
}

async function main() {
	for (const category of categories) {
		for (let i = 1; i <= 2; i++) {
			await prisma.product.create({
				data: {
					name: `${category} Product ${i}`,
					description: `High-quality ${category.toLowerCase()} product with excellent features.`,
					price: randomPrice(),
					image: imageMap[category],
					category,
					subcategory: randomSubcategory(),
					sizes,
					bestseller: Math.random() > 0.7,
					stock: randomStock(),
					specification: `Specifications for ${category} Product ${i}`,
					date: BigInt(Date.now()),
				},
			});
		}
	}

	console.log("✅ Seed data inserted successfully");
}

main()
	.catch((e) => {
		console.error(e);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
