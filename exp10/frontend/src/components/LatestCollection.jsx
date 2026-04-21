import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
	const { products } = useContext(ShopContext);
	const [latestProducts, setLatestProducts] = useState([]);

	useEffect(() => {
		setLatestProducts(products.slice(0, 12));
	}, [products]);

	return (
		<div className="my-8">
			<div className="bg-gray-100 py-6 px-4 sm:px-6 md:px-8 rounded-lg mb-6">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
							Best New Arrivals
						</h2>
						<p className="text-xs sm:text-sm text-gray-600 mt-1">
							Discover the latest products just added to our store
						</p>
					</div>
					<span className="text-4xl">✨</span>
				</div>
			</div>

			{/*Rendering products */}
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
				{latestProducts.length > 0 ? (
					latestProducts.map((item, index) => (
						<ProductItem
							key={index}
							id={item._id}
							image={item.image}
							name={item.name}
							price={item.price}
							stock={item.stock}
						/>
					))
				) : (
					<p className="text-center text-gray-500 col-span-full py-8">
						Loading products...
					</p>
				)}
			</div>
		</div>
	);
};

export default LatestCollection;
