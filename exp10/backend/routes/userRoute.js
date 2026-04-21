import express from "express";
import {
	loginUser,
	adminLogin,
	registerUser,
	addToWishlist,
	removeFromWishlist,
	getWishlist,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/wishlist/add", auth, addToWishlist);
userRouter.post("/wishlist/remove", auth, removeFromWishlist);
userRouter.post("/wishlist/get", auth, getWishlist);

export default userRouter;
