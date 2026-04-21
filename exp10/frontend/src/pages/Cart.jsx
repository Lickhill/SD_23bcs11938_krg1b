import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";

const Cart = () => {
	const { products, currency, cartItems, updateQuantity, navigate } =
		useContext(ShopContext);

	const [cartData, setCartData] = useState([]);
	const [hasOutOfStockItems, setHasOutOfStockItems] = useState(false);

	useEffect(() => {
		if (products.length > 0) {
			const tempData = [];
			let hasOutOfStock = false;
			for (const items in cartItems) {
				for (const item in cartItems[items]) {
					if (cartItems[items][item] > 0) {
						tempData.push({
							_id: items,
							size: item,
							quantity: cartItems[items][item],
						});
						// Check if this product is out of stock
						const product = products.find((p) => p._id === items);
						if (product && product.stock === 0) {
							hasOutOfStock = true;
						}
					}
				}
			}
			setCartData(tempData);
			setHasOutOfStockItems(hasOutOfStock);
		}
	}, [cartItems, products]);

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="text-3xl mb-8 font-bold text-gray-800">
					<Title text1={"YOUR"} text2={"CART"} />
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Cart Items Section */}
					<div className="lg:col-span-2">
						<div className="bg-white rounded-lg shadow-sm">
							{cartData.length > 0 ? (
								cartData.map((item, index) => {
									const productData = products.find(
										(product) => product._id === item._id,
									);

									return (
										<div
											key={index}
											className="border-b last:border-b-0 p-4 hover:bg-gray-50 transition"
										>
											{/* Top Section - Image, Details, Quantity */}
											<div className="flex gap-4 items-start mb-4">
												{/* Product Image */}
												<div className="flex-shrink-0">
													<img
														className="w-20 h-20 object-cover rounded"
														src={
															productData.image[0]
														}
														alt={productData.name}
													/>
												</div>

												{/* Product Details */}
												<div className="flex-grow">
													<h3 className="text-base font-medium text-gray-900 line-clamp-2">
														{productData.name}
													</h3>
													<div className="flex items-center gap-4 mt-2">
														<p className="text-lg font-semibold text-gray-900">
															{currency}
															{productData.price}
														</p>
														<p className="px-2 py-1 bg-gray-100 text-xs font-medium text-gray-700 rounded">
															{item.size}
														</p>
													</div>

													{/* Coming Soon Badge */}
													{productData.stock ===
														0 && (
														<p className="text-red-600 font-semibold text-xs mt-2">
															Coming Soon
														</p>
													)}
												</div>

												{/* Quantity Controls */}
												<div className="flex items-center border border-gray-300 rounded flex-shrink-0">
													<button
														onClick={() => {
															const newQty =
																item.quantity -
																1;
															if (newQty > 0) {
																updateQuantity(
																	item._id,
																	item.size,
																	newQty,
																);
															}
														}}
														disabled={
															productData.stock ===
															0
														}
														className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
													>
														−
													</button>
													<input
														disabled={true}
														className="w-12 text-center border-l border-r border-gray-300 py-1 text-sm font-medium bg-gray-50 cursor-not-allowed [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
														type="number"
														min={1}
														value={item.quantity}
														style={{
															MozAppearance:
																"textfield",
														}}
													/>
													<button
														onClick={() => {
															const newQty =
																item.quantity +
																1;
															updateQuantity(
																item._id,
																item.size,
																newQty,
															);
														}}
														disabled={
															productData.stock ===
															0
														}
														className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
													>
														+
													</button>
												</div>
											</div>

											{/* Bottom Section - Action Buttons */}
											<div className="flex gap-8 pt-3 border-t text-center">
												<button
													className="flex-1 text-gray-600 hover:text-gray-900 text-sm font-medium py-2"
													title="Save for later"
												>
													💾 Save for later
												</button>
												<button
													onClick={() =>
														updateQuantity(
															item._id,
															item.size,
															0,
														)
													}
													className="flex-1 text-gray-600 hover:text-gray-900 text-sm font-medium py-2"
													title="Remove item"
												>
													🗑️ Remove
												</button>
												<button
													onClick={() =>
														navigate("/place-order")
													}
													disabled={
														productData.stock === 0
													}
													className={`flex-1 text-sm font-medium py-2 ${
														productData.stock === 0
															? "text-gray-400 cursor-not-allowed"
															: "text-blue-600 hover:text-blue-800"
													}`}
													title="Buy this now"
												>
													⚡ Buy this now
												</button>
											</div>
										</div>
									);
								})
							) : (
								<div className="p-8 text-center">
									<p className="text-gray-500 text-lg">
										Your cart is empty
									</p>
									<button
										onClick={() => navigate("/")}
										className="mt-4 px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
									>
										Continue Shopping
									</button>
								</div>
							)}
						</div>
					</div>

					{/* Cart Summary Section */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
							{/* Cart Totals Display */}
							<CartTotal />

							{/* Out of Stock Warning */}
							{hasOutOfStockItems && (
								<div className="bg-red-50 border border-red-200 rounded p-3 mb-4 mt-4">
									<p className="text-red-600 font-semibold text-sm">
										⚠️ Please remove out-of-stock items
										before checkout
									</p>
								</div>
							)}

							{/* Proceed Button */}
							<button
								onClick={() => navigate("/place-order")}
								disabled={
									hasOutOfStockItems || cartData.length === 0
								}
								className={`w-full py-3 font-semibold rounded transition text-white mt-6 ${
									hasOutOfStockItems || cartData.length === 0
										? "bg-gray-400 cursor-not-allowed"
										: "bg-yellow-500 hover:bg-yellow-600"
								}`}
							>
								{cartData.length === 0
									? "Cart is Empty"
									: "PROCEED TO CHECKOUT"}
							</button>

							{/* Continue Shopping Link */}
							<button
								onClick={() => navigate("/")}
								className="w-full mt-3 py-3 border border-gray-300 font-semibold rounded hover:bg-gray-50 transition"
							>
								Continue Shopping
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Cart;
