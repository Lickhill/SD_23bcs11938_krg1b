import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";

const BestSeller = () => {
	const { products } = useContext(ShopContext);
	const [bestSeller, setBestSeller] = useState([]);

	useEffect(() => {
		const bestProduct = products.filter((item) => item.bestseller);
		setBestSeller(bestProduct.slice(0, 10));
	}, [products]);

	return (
		<div className="my-8">
			<div className="bg-gradient-to-r from-orange-400 to-red-500 py-6 px-4 sm:px-6 md:px-8 rounded-lg mb-6">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
							Best Sellers 🔥
						</h2>
						<p className="text-xs sm:text-sm text-white opacity-90 mt-1">
							Most loved products by our customers
						</p>
					</div>
					<span className="text-4xl">⭐</span>
				</div>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
				{bestSeller.length > 0 ? (
					bestSeller.map((item, index) => (
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
						No best sellers available
					</p>
				)}
			</div>
		</div>
	);
};

export default BestSeller;
