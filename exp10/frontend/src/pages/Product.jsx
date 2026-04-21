import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartFilled } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";

const Product = () => {
	const { productId } = useParams();
	const { products, currency, addToCart, navigate } = useContext(ShopContext);
	const [productData, setProductData] = useState(false);
	const [image, setImage] = useState("");
	const [size, setSize] = useState("");
	const [isInWishlist, setIsInWishlist] = useState(false);
	const [token, setToken] = useState("");

	useEffect(() => {
		const storedToken = localStorage.getItem("token");
		setToken(storedToken);
		products.forEach((item) => {
			if (item._id === productId) {
				setProductData(item);
				setImage(item.image[0]);
			}
		});
	}, [productId, products]);

	const handleAddToWishlist = async () => {
		try {
			if (!token) {
				toast.error("Please login to add to wishlist");
				navigate("/login");
				return;
			}

			const response = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/user/wishlist/add`,
				{ productId },
				{ headers: { token } },
			);

			if (response.data.success) {
				setIsInWishlist(true);
				toast.success("Added to wishlist");
			} else if (
				response.data.message === "Product already in wishlist"
			) {
				// Remove from wishlist
				await handleRemoveFromWishlist();
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Error adding to wishlist",
			);
		}
	};

	const handleRemoveFromWishlist = async () => {
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/user/wishlist/remove`,
				{ productId },
				{ headers: { token } },
			);

			if (response.data.success) {
				setIsInWishlist(false);
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

	const handleBuyNow = () => {
		if (!size) {
			alert("Please select a size");
			return;
		}
		addToCart(productData._id, size);
		navigate("/place-order");
	};

	return productData ? (
		<div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
			<div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
				{/*Product images */}
				<div className="flex-1 flex flex-col-reserve gap-3 sm:flex-row ">
					<div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
						{productData.image.map((item, index) => (
							<img
								onClick={() => setImage(item)}
								src={item}
								key={index}
								className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
							/>
						))}
					</div>

					<div className="w-full sm:w-[80%]">
						<img className="w-full h-auto" src={image} alt="" />
					</div>
				</div>
				{/*product info */}
				<div className="flex-1">
					<h1 className="font-medium text-2xl mt-2">
						{productData.name}
					</h1>
					<div className="flex items-center gap-1 mt-2">
						<img src={assets.star_icon} alt="" className="w-3 5" />
						<img src={assets.star_icon} alt="" className="w-3 5" />
						<img src={assets.star_icon} alt="" className="w-3 5" />
						<img src={assets.star_icon} alt="" className="w-3 5" />
						<img
							src={assets.star_dull_icon}
							alt=""
							className="w-3 5"
						/>
						<p className="pl-2">(122)</p>
					</div>
					<p className="mt-5 text-3xl font-medium">
						{currency} {productData.price}
					</p>

					{/* Stock Status */}
					<div className="mt-3">
						{productData.stock === 0 ? (
							<p className="text-red-600 font-semibold text-lg">
								Coming Soon
							</p>
						) : productData.stock < 10 ? (
							<p className="text-orange-600 font-semibold">
								Limited Stock Available
							</p>
						) : (
							<p className="text-green-600 font-semibold">
								In Stock
							</p>
						)}
					</div>

					<p className="mt-5 text-gray-500 md:w-4/5">
						{productData.description}
					</p>

					{/* Specification Section */}
					{productData.specification && (
						<div className="mt-5 border-t pt-5">
							<p className="font-semibold text-lg mb-3">
								Specifications
							</p>
							<p className="text-gray-600 whitespace-pre-line">
								{productData.specification}
							</p>
						</div>
					)}

					<div className="flex flex-col gap-4 my-8">
						<p>Select Size</p>
						<div className="flex gap-2">
							{productData.sizes.map((item, index) => (
								<button
									onClick={() => setSize(item)}
									className={`border py-2 px-4 bg-gray-100 ${item === size ? "border-orange-500" : ""}`}
									key={index}
								>
									{" "}
									{item}{" "}
								</button>
							))}
						</div>
					</div>

					<button
						onClick={() => addToCart(productData._id, size)}
						disabled={productData.stock === 0}
						className={`px-8 py-3 text-sm active:bg-gray-700 ${
							productData.stock === 0
								? "bg-gray-400 text-gray-600 cursor-not-allowed"
								: "bg-black text-white"
						}`}
					>
						ADD TO CART
					</button>
					<button
						onClick={handleBuyNow}
						disabled={productData.stock === 0}
						className={`px-8 py-3 text-sm ml-4 active:bg-blue-700 ${
							productData.stock === 0
								? "bg-gray-400 text-gray-600 cursor-not-allowed"
								: "bg-blue-600 text-white"
						}`}
					>
						BUY NOW
					</button>
					<button
						onClick={handleAddToWishlist}
						className="px-8 py-3 text-sm ml-4 bg-red-100 text-red-600 hover:bg-red-200 transition"
						title="Add to wishlist"
					>
						<FontAwesomeIcon
							icon={isInWishlist ? faHeartFilled : faHeartEmpty}
							className="mr-2"
						/>
						{isInWishlist ? "In Wishlist" : "Add to Wishlist"}
					</button>
					<hr className="mt-8 sm:4/5" />
					<div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
						<p>100% Original product.</p>
						<p>Cash on delivery is available on this product.</p>
						<p>Easy return and exchange policy within 7 days.</p>
					</div>
				</div>
			</div>

			{/*Description and review section */}
			<div className="mt-20">
				<div className="flex">
					<b className="border px-5 py-3 text-sm">Description</b>
					<p className="border px-5 py-3 text-sm">Reviews (122)</p>
				</div>
				<div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
					<p>
						At LICKHILL, we craft clothing that blends comfort with
						style, making every outfit a statement of confidence and
						fashion. From breezy casuals to bold statement pieces,
						our collection is designed to complement your every mood
						and moment.
					</p>
					<p>
						With premium fabrics, intricate details, and a focus on
						individuality, LICKHILL lets you express your unique
						style effortlessly. Whether it's everyday wear or a
						special occasion, our pieces ensure you feel as good as
						you look—stylish, confident, and true to yourself.
					</p>
				</div>
			</div>

			{/*display related products */}

			<RelatedProducts
				category={productData.category}
				subCategory={productData.subCategory}
			/>
		</div>
	) : (
		<div className="opacity-0"></div>
	);
};

export default Product;
