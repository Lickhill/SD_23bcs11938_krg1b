import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faShoppingCart,
	faTrash,
	faTimes,
} from "@fortawesome/free-solid-svg-icons";

const Wishlist = () => {
	const { currency, navigate } = useContext(ShopContext);
	const [wishlistItems, setWishlistItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const [token, setToken] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("token");
		setToken(token);
		if (token) {
			fetchWishlist(token);
		}
	}, []);

	const fetchWishlist = async (token) => {
		try {
			setLoading(true);
			const response = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/user/wishlist/get`,
				{},
				{ headers: { token } },
			);

			if (response.data.success) {
				setWishlistItems(response.data.wishlist);
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Error fetching wishlist",
			);
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveFromWishlist = async (productId) => {
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/user/wishlist/remove`,
				{ productId },
				{ headers: { token } },
			);

			if (response.data.success) {
				setWishlistItems(
					wishlistItems.filter((item) => item._id !== productId),
				);
				toast.success("Removed from wishlist");
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Error removing from wishlist",
			);
		}
	};

	const handleAddToCart = async (productId, size = "M") => {
		try {
			if (!token) {
				toast.error("Please login to add to cart");
				navigate("/login");
				return;
			}

			const response = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
				{ itemId: productId, size },
				{ headers: { token } },
			);

			if (response.data.success) {
				toast.success("Added to cart");
			} else {
				toast.error(response.data.message || "Error adding to cart");
			}
		} catch (error) {
			console.log("Add to cart error:", error);
			toast.error("Error adding to cart");
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-gray-600">Loading...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="text-3xl mb-8 font-bold text-gray-800">
					<Title text1={"MY"} text2={"WISHLIST"} />
				</div>

				{wishlistItems.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{wishlistItems.map((item, index) => (
							<div
								key={index}
								className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition group"
							>
								{/* Product Image */}
								<div className="relative w-full h-64 bg-gray-200 overflow-hidden">
									<img
										className="w-full h-full object-cover group-hover:scale-110 transition"
										src={item.image[0]}
										alt={item.name}
									/>
									{/* Remove Button */}
									<button
										onClick={() =>
											handleRemoveFromWishlist(item._id)
										}
										className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
										title="Remove from wishlist"
									>
										<FontAwesomeIcon
											icon={faTimes}
											className="w-4 h-4"
										/>
									</button>
									{/* Stock Badge */}
									{item.stock === 0 && (
										<div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
											<p className="text-white font-bold text-center px-4">
												Coming Soon
											</p>
										</div>
									)}
								</div>

								{/* Product Details */}
								<div className="p-4">
									<h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-2">
										{item.name}
									</h3>

									{/* Price */}
									<p className="text-xl font-bold text-gray-900 mb-3">
										{currency}
										{item.price}
									</p>

									{/* Stock Status */}
									<div className="mb-3">
										{item.stock > 0 ? (
											item.stock < 10 ? (
												<p className="text-orange-500 text-sm font-medium">
													Limited Stock Available
												</p>
											) : (
												<p className="text-green-600 text-sm font-medium">
													In Stock
												</p>
											)
										) : (
											<p className="text-red-600 text-sm font-medium">
												Out of Stock
											</p>
										)}
									</div>

									{/* Action Buttons */}
									<div className="flex gap-2">
										<button
											onClick={() =>
												handleAddToCart(item._id)
											}
											disabled={item.stock === 0}
											className={`flex-1 flex items-center justify-center gap-2 py-2 rounded font-medium transition ${
												item.stock === 0
													? "bg-gray-200 text-gray-400 cursor-not-allowed"
													: "bg-blue-600 text-white hover:bg-blue-700"
											}`}
										>
											<FontAwesomeIcon
												icon={faShoppingCart}
												className="w-4 h-4"
											/>
											Add to Cart
										</button>
										<button
											onClick={() =>
												handleRemoveFromWishlist(
													item._id,
												)
											}
											className="flex-1 flex items-center justify-center gap-2 py-2 rounded font-medium bg-red-100 text-red-600 hover:bg-red-200 transition"
										>
											<FontAwesomeIcon
												icon={faTrash}
												className="w-4 h-4"
											/>
											Remove
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="bg-white rounded-lg shadow-sm p-12 text-center">
						<p className="text-gray-500 text-lg mb-4">
							Your wishlist is empty
						</p>
						<button
							onClick={() => navigate("/")}
							className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
						>
							Continue Shopping
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Wishlist;
