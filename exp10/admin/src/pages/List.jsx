import axios from "axios";
import React from "react";
import { backendUrl, currency } from "../App";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const List = ({ token }) => {
	const [list, setList] = useState([]);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);
	const [editFormData, setEditFormData] = useState({
		name: "",
		description: "",
		price: "",
		stock: "",
		category: "",
		subcategory: "",
		bestseller: false,
		sizes: [],
		image: [],
	});
	const [newImages, setNewImages] = useState({
		image1: null,
		image2: null,
		image3: null,
		image4: null,
	});

	const fetchList = async () => {
		try {
			const response = await axios.get(backendUrl + "/api/product/list");
			if (response.data.products) {
				setList(response.data.products);
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	const removeProduct = async (id) => {
		try {
			const response = await axios.post(
				backendUrl + "/api/product/remove",
				{ id },
				{ headers: { token } },
			);

			if (response.data.success) {
				toast.success(response.data.message);
				await fetchList();
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	const openEditModal = (product) => {
		setEditingProduct(product);
		setEditFormData({
			name: product.name,
			description: product.description,
			price: product.price,
			stock: product.stock,
			category: product.category,
			subcategory: product.subcategory,
			bestseller: product.bestseller,
			sizes: product.sizes,
			image: product.image,
		});
		setNewImages({
			image1: null,
			image2: null,
			image3: null,
			image4: null,
		});
		setShowEditModal(true);
	};

	const handleImageChange = (e, imageNum) => {
		const file = e.target.files[0];
		if (file) {
			setNewImages((prev) => ({
				...prev,
				[`image${imageNum}`]: file,
			}));
		}
	};

	const handleSizeToggle = (size) => {
		setEditFormData((prev) => ({
			...prev,
			sizes: prev.sizes.includes(size)
				? prev.sizes.filter((s) => s !== size)
				: [...prev.sizes, size],
		}));
	};

	const handleUpdateProduct = async (e) => {
		e.preventDefault();

		try {
			const formData = new FormData();

			formData.append("id", editingProduct._id || editingProduct.id);
			formData.append("name", editFormData.name);
			formData.append("description", editFormData.description);
			formData.append("price", editFormData.price);
			formData.append("stock", editFormData.stock);
			formData.append("category", editFormData.category);
			formData.append("subcategory", editFormData.subcategory);
			formData.append("bestseller", editFormData.bestseller);
			formData.append("sizes", JSON.stringify(editFormData.sizes));

			// Only append new images if they were selected
			Object.entries(newImages).forEach(([key, file]) => {
				if (file) {
					formData.append(key, file);
				}
			});

			const response = await axios.post(
				backendUrl + "/api/product/update",
				formData,
				{ headers: { token } },
			);

			if (response.data.success) {
				toast.success(response.data.message);
				setShowEditModal(false);
				await fetchList();
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	useEffect(() => {
		fetchList();
	}, []);

	return (
		<>
			<p className="mb-2">All Products List</p>
			<div className="flex flex-col gap-2">
				{/*List table title*/}

				<div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
					<b>Image</b>
					<b>Name</b>
					<b>Category</b>
					<b>Price</b>
					<b>Stock</b>
					<b className="text-center">Action</b>
				</div>

				{/*product list */}
				{list.map((item, index) => (
					<div
						className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
						key={index}
					>
						<img className="w-12" src={item.image[0]} alt="" />
						<p>{item.name}</p>
						<p>{item.category}</p>
						<p>
							{currency}
							{item.price}
						</p>
						<p>{item.stock}</p>
						<div className="flex gap-2 justify-end md:justify-center">
							<p
								onClick={() => openEditModal(item)}
								className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
								title="Edit product"
							>
								✎
							</p>
							<p
								onClick={() => removeProduct(item._id)}
								className="cursor-pointer text-lg"
								title="Delete product"
							>
								X
							</p>
						</div>
					</div>
				))}
			</div>

			{/* Edit Modal */}
			{showEditModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-2xl font-bold">Edit Product</h2>
							<button
								onClick={() => setShowEditModal(false)}
								className="text-2xl font-bold text-gray-600 hover:text-gray-800"
							>
								×
							</button>
						</div>

						<form onSubmit={handleUpdateProduct}>
							{/* Images Section */}
							<div className="mb-6">
								<p className="mb-2 font-semibold">
									Product Images
								</p>
								<div className="flex gap-2 flex-wrap">
									{[1, 2, 3, 4].map((num) => (
										<label
											key={num}
											className="relative w-20 h-20 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-gray-500"
										>
											<img
												className="w-full h-full object-cover rounded"
												src={
													newImages[`image${num}`]
														? URL.createObjectURL(
																newImages[
																	`image${num}`
																],
															)
														: editFormData.image[
																	num - 1
															  ]
															? editFormData
																	.image[
																	num - 1
																]
															: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23f3f4f6' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' font-size='12' fill='%239ca3af' text-anchor='middle' dy='.3em'%3EAdd%3C/text%3E%3C/svg%3E"
												}
												alt={`Product ${num}`}
											/>
											<input
												type="file"
												accept="image/*"
												hidden
												onChange={(e) =>
													handleImageChange(e, num)
												}
											/>
										</label>
									))}
								</div>
							</div>

							{/* Product Details */}
							<div className="mb-4">
								<label className="block text-sm font-medium mb-1">
									Product Name
								</label>
								<input
									type="text"
									value={editFormData.name}
									onChange={(e) =>
										setEditFormData((prev) => ({
											...prev,
											name: e.target.value,
										}))
									}
									className="w-full border rounded px-3 py-2"
									required
								/>
							</div>

							<div className="mb-4">
								<label className="block text-sm font-medium mb-1">
									Description
								</label>
								<textarea
									value={editFormData.description}
									onChange={(e) =>
										setEditFormData((prev) => ({
											...prev,
											description: e.target.value,
										}))
									}
									className="w-full border rounded px-3 py-2 h-24"
									required
								/>
							</div>

							{/* Category and Subcategory */}
							<div className="grid grid-cols-2 gap-4 mb-4">
								<div>
									<label className="block text-sm font-medium mb-1">
										Category
									</label>
									<select
										value={editFormData.category}
										onChange={(e) =>
											setEditFormData((prev) => ({
												...prev,
												category: e.target.value,
											}))
										}
										className="w-full border rounded px-3 py-2"
									>
										<option value="For You">For You</option>
										<option value="Fashion">Fashion</option>
										<option value="Mobiles">Mobiles</option>
										<option value="Beauty">Beauty</option>
										<option value="Electronics">
											Electronics
										</option>
										<option value="Home">Home</option>
										<option value="Appliances">
											Appliances
										</option>
										<option value="Toys, Baby & More">
											Toys, Baby & More
										</option>
										<option value="Food & Health">
											Food & Health
										</option>
										<option value="Auto Accessories">
											Auto Accessories
										</option>
										<option value="2 Wheelers">
											2 Wheelers
										</option>
										<option value="Sports & Outdoors">
											Sports & Outdoors
										</option>
										<option value="Books & More">
											Books & More
										</option>
										<option value="Furniture">
											Furniture
										</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium mb-1">
										Subcategory
									</label>
									<select
										value={editFormData.subcategory}
										onChange={(e) =>
											setEditFormData((prev) => ({
												...prev,
												subcategory: e.target.value,
											}))
										}
										className="w-full border rounded px-3 py-2"
									>
										<option value="Standard">
											Standard
										</option>
										<option value="Premium">Premium</option>
										<option value="Budget">Budget</option>
										<option value="Luxury">Luxury</option>
										<option value="Basic">Basic</option>
									</select>
								</div>
							</div>

							{/* Price and Stock */}
							<div className="grid grid-cols-2 gap-4 mb-4">
								<div>
									<label className="block text-sm font-medium mb-1">
										Price
									</label>
									<input
										type="number"
										value={editFormData.price}
										onChange={(e) =>
											setEditFormData((prev) => ({
												...prev,
												price: e.target.value,
											}))
										}
										className="w-full border rounded px-3 py-2"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-1">
										Stock
									</label>
									<input
										type="number"
										value={editFormData.stock}
										onChange={(e) =>
											setEditFormData((prev) => ({
												...prev,
												stock: e.target.value,
											}))
										}
										className="w-full border rounded px-3 py-2"
										required
									/>
								</div>
							</div>

							{/* Sizes */}
							<div className="mb-4">
								<label className="block text-sm font-medium mb-2">
									Available Sizes
								</label>
								<div className="flex gap-2 flex-wrap">
									{["S", "M", "L", "XL", "XXL"].map(
										(size) => (
											<button
												key={size}
												type="button"
												onClick={() =>
													handleSizeToggle(size)
												}
												className={`px-3 py-1 rounded ${
													editFormData.sizes.includes(
														size,
													)
														? "bg-pink-100 border border-pink-500"
														: "bg-gray-200 border border-gray-300"
												}`}
											>
												{size}
											</button>
										),
									)}
								</div>
							</div>

							{/* Bestseller Checkbox */}
							<div className="mb-6 flex items-center gap-2">
								<input
									type="checkbox"
									id="bestseller"
									checked={editFormData.bestseller}
									onChange={(e) =>
										setEditFormData((prev) => ({
											...prev,
											bestseller: e.target.checked,
										}))
									}
								/>
								<label
									htmlFor="bestseller"
									className="text-sm font-medium"
								>
									Add to bestseller
								</label>
							</div>

							{/* Buttons */}
							<div className="flex gap-4 justify-end">
								<button
									type="button"
									onClick={() => setShowEditModal(false)}
									className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
								>
									Update Product
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
};

export default List;
