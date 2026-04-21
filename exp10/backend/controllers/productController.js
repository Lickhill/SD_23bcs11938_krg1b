import { v2 as cloudinary } from "cloudinary";
import prisma from "../config/db.js";

//function for add product
const addProduct = async (req, res) => {
	try {
		const {
			name,
			description,
			price,
			category,
			subcategory,
			sizes,
			bestseller,
			stock,
			specification,
		} = req.body;

		const image1 = req.files.image1 && req.files.image1[0];
		const image2 = req.files.image2 && req.files.image2[0];
		const image3 = req.files.image3 && req.files.image3[0];
		const image4 = req.files.image4 && req.files.image4[0];

		const images = [image1, image2, image3, image4].filter(
			(item) => item !== undefined,
		);

		let imagesUrl = await Promise.all(
			images.map(async (item) => {
				let result = await cloudinary.uploader.upload(item.path, {
					resource_type: "image",
				});
				return result.secure_url;
			}),
		);

		const productData = {
			name,
			description,
			category,
			price: Number(price),
			subcategory,
			bestseller: bestseller === "true" ? true : false,
			stock: Number(stock) || 0,
			sizes: JSON.parse(sizes),
			image: imagesUrl,
			specification: specification || "",
			date: Date.now(),
		};

		const product = await prisma.product.create({
			data: productData,
		});

		res.json({ success: true, message: "Product Added" });
	} catch (error) {
		console.log(error);

		res.json({ success: false, message: error.message });
	}
};

//function for list product
const listProducts = async (req, res) => {
	try {
		const products = await prisma.product.findMany();
		// Convert BigInt to string and map id to _id for frontend compatibility
		const productsFormatted = products.map((product) => ({
			...product,
			_id: product.id,
			date: product.date.toString(),
		}));
		res.json({ success: true, products: productsFormatted });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

//removing product
const removeProduct = async (req, res) => {
	try {
		await prisma.product.delete({
			where: { id: req.body.id },
		});
		res.json({ success: true, message: "Product removed" });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

//function for single product info
const singleProduct = async (req, res) => {
	try {
		const { productId } = req.body;
		const product = await prisma.product.findUnique({
			where: { id: productId },
		});
		// Convert BigInt to string and map id to _id for frontend compatibility
		if (product) {
			product.date = product.date.toString();
			product._id = product.id;
		}
		res.json({ success: true, product });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

//function for update product
const updateProduct = async (req, res) => {
	try {
		const {
			id,
			name,
			description,
			price,
			category,
			subcategory,
			sizes,
			bestseller,
			stock,
			specification,
		} = req.body;

		let imagesUrl = [];

		// Handle new images if provided
		if (req.files && Object.keys(req.files).length > 0) {
			const image1 = req.files.image1 && req.files.image1[0];
			const image2 = req.files.image2 && req.files.image2[0];
			const image3 = req.files.image3 && req.files.image3[0];
			const image4 = req.files.image4 && req.files.image4[0];

			const images = [image1, image2, image3, image4].filter(
				(item) => item !== undefined,
			);

			imagesUrl = await Promise.all(
				images.map(async (item) => {
					let result = await cloudinary.uploader.upload(item.path, {
						resource_type: "image",
					});
					return result.secure_url;
				}),
			);
		}

		const updateData = {
			name,
			description,
			category,
			price: Number(price),
			subcategory,
			bestseller: bestseller === "true" ? true : false,
			stock: Number(stock) || 0,
			sizes: JSON.parse(sizes),
			specification: specification || "",
		};

		// Only update images if new ones were uploaded
		if (imagesUrl.length > 0) {
			updateData.image = imagesUrl;
		}

		const product = await prisma.product.update({
			where: { id },
			data: updateData,
		});

		// Convert BigInt to string and map id to _id for frontend compatibility
		const productFormatted = {
			...product,
			_id: product.id,
			date: product.date.toString(),
		};

		res.json({
			success: true,
			message: "Product Updated",
			product: productFormatted,
		});
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export {
	listProducts,
	addProduct,
	removeProduct,
	singleProduct,
	updateProduct,
};
