import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

//Route for user login

const createToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET);
};

const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return res.json({ success: false, message: "User doesn't exists" });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (isMatch) {
			const token = createToken(user.id);
			res.json({ success: true, token });
		} else {
			res.json({ success: false, message: "Invalid credentials" });
		}
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

//route for user register
const registerUser = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		//checking user already exists or not
		const exists = await prisma.user.findUnique({
			where: { email },
		});

		if (exists) {
			return res.json({ success: false, message: "User already exists" });
		}

		//validating email format and strong password
		if (!validator.isEmail(email)) {
			return res.json({
				success: false,
				message: "Please enter a valid email",
			});
		}
		if (password.length < 8) {
			return res.json({
				success: false,
				message: "Please enter a strong password",
			});
		}

		//hashing user password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		});

		const token = createToken(user.id);

		res.json({ success: true, token });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

//ROute for admin login
const adminLogin = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (
			email === process.env.ADMIN_EMAIL &&
			password === process.env.ADMIN_PASSWORD
		) {
			const token = jwt.sign(email + password, process.env.JWT_SECRET);
			res.json({ success: true, token });
		} else {
			res.json({ success: false, message: "Invalid credentials" });
		}
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

// Add to wishlist
const addToWishlist = async (req, res) => {
	try {
		const { userId, productId } = req.body;

		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			return res.json({ success: false, message: "User not found" });
		}

		// Check if product already in wishlist
		if (user.wishlist.includes(productId)) {
			return res.json({
				success: false,
				message: "Product already in wishlist",
			});
		}

		// Add to wishlist
		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: {
				wishlist: {
					push: productId,
				},
			},
		});

		res.json({
			success: true,
			message: "Added to wishlist",
			wishlist: updatedUser.wishlist,
		});
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
	try {
		const { userId, productId } = req.body;

		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			return res.json({ success: false, message: "User not found" });
		}

		// Remove from wishlist
		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: {
				wishlist: user.wishlist.filter((id) => id !== productId),
			},
		});

		res.json({
			success: true,
			message: "Removed from wishlist",
			wishlist: updatedUser.wishlist,
		});
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

// Get wishlist
const getWishlist = async (req, res) => {
	try {
		const { userId } = req.body;

		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			return res.json({ success: false, message: "User not found" });
		}

		// Get wishlist products
		const wishlistProducts = await prisma.product.findMany({
			where: {
				id: {
					in: user.wishlist,
				},
			},
		});

		// Format products
		const formattedProducts = wishlistProducts.map((product) => ({
			...product,
			_id: product.id,
			date: product.date.toString(),
		}));

		res.json({ success: true, wishlist: formattedProducts });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export {
	loginUser,
	registerUser,
	adminLogin,
	addToWishlist,
	removeFromWishlist,
	getWishlist,
};
