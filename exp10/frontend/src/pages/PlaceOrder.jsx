import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
	const [method, setMethod] = useState("cod");
	const {
		navigate,
		backendUrl,
		token,
		cartItems,
		setCartItems,
		getCartAmount,
		getDeliveryFee,
		products,
		currency,
	} = useContext(ShopContext);

	const cartAmount = getCartAmount();
	const delivery_fee = getDeliveryFee(cartAmount);

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		street: "",
		city: "",
		state: "",
		zipcode: "",
		country: "",
		phone: "",
	});

	const [showConfirmation, setShowConfirmation] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [orderItems, setOrderItems] = useState([]);

	const onChangeHandler = (event) => {
		const name = event.target.name;
		const value = event.target.value;

		setFormData((data) => ({ ...data, [name]: value }));
	};

	const onSubmitHandler = async (event) => {
		event.preventDefault();
		try {
			let items = [];

			for (const itemId in cartItems) {
				for (const size in cartItems[itemId]) {
					if (cartItems[itemId][size] > 0) {
						const itemInfo = structuredClone(
							products.find((product) => product._id === itemId),
						);
						if (itemInfo) {
							itemInfo.size = size;
							itemInfo.quantity = cartItems[itemId][size];
							items.push(itemInfo);
						}
					}
				}
			}

			setOrderItems(items);
			setShowConfirmation(true);
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	const confirmOrder = async () => {
		try {
			let orderData = {
				address: formData,
				items: orderItems,
				amount: cartAmount + delivery_fee,
			};

			switch (method) {
				case "cod": {
					const response = await axios.post(
						backendUrl + "/api/orders/place",
						orderData,
						{ headers: { token } },
					);

					if (response.data.success) {
						setShowConfirmation(false);
						setShowSuccess(true);
						setCartItems({});
						setTimeout(() => {
							setShowSuccess(false);
							navigate("/orders");
						}, 3000);
					} else {
						toast.error(response.data.message);
					}
					break;
				}

				default:
					break;
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	return (
		<>
			<form
				onSubmit={onSubmitHandler}
				className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt14 min-h-[80vh] border-t"
			>
				{/* left side*/}
				<div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
					<div className="text-xl sm:text-2xl my-3">
						<Title text1={"DELIVERY"} text2={"INFORMATION"} />
					</div>
					<div className="flex gap-3">
						<input
							required
							onChange={onChangeHandler}
							name="firstName"
							value={formData.firstName}
							className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
							type="text"
							placeholder="First name"
						/>
						<input
							required
							onChange={onChangeHandler}
							name="lastName"
							value={formData.lastName}
							className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
							type="text"
							placeholder="Last name"
						/>
					</div>
					<input
						required
						onChange={onChangeHandler}
						name="email"
						value={formData.email}
						className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
						type="text"
						placeholder="Email address"
					/>
					<input
						required
						onChange={onChangeHandler}
						name="street"
						value={formData.street}
						className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
						type="text"
						placeholder="Street"
					/>
					<div className="flex gap-3">
						<input
							required
							onChange={onChangeHandler}
							name="city"
							value={formData.city}
							className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
							type="text"
							placeholder="City"
						/>
						<input
							required
							onChange={onChangeHandler}
							name="state"
							value={formData.state}
							className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
							type="text"
							placeholder="State"
						/>
					</div>
					<div className="flex gap-3">
						<input
							required
							onChange={onChangeHandler}
							name="zipcode"
							value={formData.zipcode}
							className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
							type="number"
							placeholder="Zipcode"
						/>
						<input
							required
							onChange={onChangeHandler}
							name="country"
							value={formData.country}
							className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
							type="text"
							placeholder="Country"
						/>
					</div>
					<input
						required
						onChange={onChangeHandler}
						name="phone"
						value={formData.phone}
						className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
						type="number"
						placeholder="Phone"
					/>
				</div>

				{/*Right side */}
				<div className="mt-8">
					<div className="mt-8 min-w-80">
						<CartTotal />
					</div>
					<div className="mt-12">
						<Title text1={"PAYMENT"} text2={"METHOD"} />
						{/* payment method seletion */}
						<div className="flex gap-3  flex-col lg:flex-row">
							<div
								onClick={() => setMethod("cod")}
								className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
							>
								<p
									className={`min-w-3.5 h-3.5 border rounded-full ${method === "cod" ? "bg-green-400" : ""}`}
								></p>
								<p className="text-gray-500 text-sm font-medium mx-4">
									CASH ON DELIVERY
								</p>
							</div>
						</div>

						<div className="w-full text-end mt-8">
							<button
								type="submit"
								className="bg-black text-white px-16 py-3 text-sm"
							>
								PLACE ORDER
							</button>
						</div>
					</div>
				</div>
			</form>

			{/* Confirmation Modal */}
			{showConfirmation && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold">
								Order Confirmation
							</h2>
							<button
								onClick={() => setShowConfirmation(false)}
								className="text-2xl"
							>
								&times;
							</button>
						</div>

						{/* Order Items */}
						<div className="mb-6">
							<h3 className="text-lg font-semibold mb-4">
								Order Items
							</h3>
							{orderItems.map((item, index) => (
								<div
									key={index}
									className="flex gap-4 border-b pb-4 mb-4"
								>
									<img
										src={item.image[0]}
										alt={item.name}
										className="w-20 h-20 object-cover rounded"
									/>
									<div className="flex-1">
										<p className="font-medium">
											{item.name}
										</p>
										<p className="text-gray-600 text-sm">
											Size: {item.size}
										</p>
										<p className="text-gray-600 text-sm">
											Quantity: {item.quantity}
										</p>
										<p className="font-semibold">
											{currency}
											{item.price} × {item.quantity} ={" "}
											{currency}
											{item.price * item.quantity}
										</p>
									</div>
								</div>
							))}
						</div>

						{/* Total */}
						<div className="border-t pt-4 mb-6">
							<div className="flex justify-between mb-2">
								<p>Subtotal:</p>
								<p>
									{currency}
									{cartAmount}
								</p>
							</div>
							<div className="flex justify-between mb-2">
								<p>Delivery Fee:</p>
								<p>
									{currency}
									{delivery_fee}
								</p>
							</div>
							<div className="flex justify-between text-lg font-bold">
								<p>Total:</p>
								<p>
									{currency}
									{cartAmount + delivery_fee}
								</p>
							</div>
						</div>

						{/* Address */}
						<div className="border-t pt-4 mb-6">
							<h3 className="text-lg font-semibold mb-4">
								Delivery Address
							</h3>
							<p className="text-gray-700">
								{formData.firstName} {formData.lastName}
								<br />
								{formData.street}
								<br />
								{formData.city}, {formData.state}{" "}
								{formData.zipcode}
								<br />
								{formData.country}
								<br />
								Phone: {formData.phone}
								<br />
								Email: {formData.email}
							</p>
						</div>

						{/* Payment Method */}
						<div className="border-t pt-4 mb-6">
							<p className="text-gray-700">
								<strong>Payment Method:</strong> Cash on
								Delivery
							</p>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-4">
							<button
								onClick={() => setShowConfirmation(false)}
								className="flex-1 bg-gray-300 text-black px-4 py-3 rounded font-medium"
							>
								Cancel
							</button>
							<button
								onClick={confirmOrder}
								className="flex-1 bg-black text-white px-4 py-3 rounded font-medium"
							>
								Confirm & Place Order
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Success Modal */}
			{showSuccess && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
						<div className="text-6xl mb-4">✅</div>
						<h2 className="text-2xl font-bold mb-4">
							Order Placed Successfully!
						</h2>

						<div className="bg-gray-50 p-4 rounded mb-6 text-left">
							<p className="mb-2">
								<strong>Total Amount:</strong> {currency}
								{cartAmount + delivery_fee}
							</p>
							<p className="mb-2">
								<strong>Payment Method:</strong> Cash on
								Delivery
							</p>
							<p className="mb-2">
								<strong>Delivery To:</strong>
							</p>
							<p className="text-sm text-gray-600">
								{formData.street}, {formData.city},{" "}
								{formData.state} {formData.zipcode}
							</p>
						</div>

						<p className="text-gray-600 text-sm mb-4">
							Redirecting to orders page...
						</p>
						<button
							onClick={() => {
								setShowSuccess(false);
								navigate("/orders");
							}}
							className="bg-black text-white px-8 py-3 rounded font-medium w-full"
						>
							View My Orders
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default PlaceOrder;
