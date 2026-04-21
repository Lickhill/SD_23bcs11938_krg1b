import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
	const navigate = useNavigate();
	const [currentBanner, setCurrentBanner] = useState(0);

	const banners = [
		{
			color: "bg-gradient-to-r from-blue-900 to-blue-700",
			title: "India ka Captain Cool",
			price: "From ₹31,250*",
			subtitle: "Trusted AC for Smart India",
			brand: "Panasonic",
			icon: "❄️",
		},
		{
			color: "bg-gradient-to-r from-blue-600 to-blue-400",
			title: "Smart ACs",
			price: "From ₹28,990*",
			subtitle: "Enjoy benefits worth ₹10,750",
			brand: "Motorola",
			icon: "🤖",
		},
		{
			color: "bg-gradient-to-r from-yellow-400 to-yellow-500",
			title: "Cooling & comfort",
			price: "Up to 50% Off",
			subtitle: "Perfectly made for every home",
			brand: "VOLTAS",
			icon: "❄️",
		},
		{
			color: "bg-gradient-to-r from-indigo-900 to-indigo-700",
			title: "Premium Collection",
			price: "Exclusive Items",
			subtitle: "Curated for you",
			brand: "Premium",
			icon: "⭐",
		},
		{
			color: "bg-gradient-to-r from-green-600 to-green-400",
			title: "Mega Savings",
			price: "Extra 30% Off",
			subtitle: "On selected electronics",
			brand: "Tech Hub",
			icon: "💚",
		},
		{
			color: "bg-gradient-to-r from-pink-600 to-pink-400",
			title: "Fashion Fest",
			price: "Upto ₹5000 Off",
			subtitle: "On latest collections",
			brand: "Style Zone",
			icon: "👗",
		},
	];

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentBanner((prev) => {
				const maxIndex = Math.max(0, banners.length - 2.5);
				return prev >= maxIndex ? 0 : prev + 1;
			});
		}, 5000);
		return () => clearInterval(timer);
	}, [banners.length]);

	return (
		<div className="w-full mt-6 sm:mt-8 md:mt-10">
			{/* Card Carousel - Flipkart Style - 2.5 Cards */}
			<div className="relative w-full mb-6">
				<div className="overflow-hidden rounded-lg">
					<div
						className="flex gap-3 transition-transform duration-700"
						style={{
							transform: `translateX(-${currentBanner * (100 / 2.5)}%)`,
						}}
					>
						{banners.map((banner, index) => (
							<div
								key={index}
								className={`flex-shrink-0 ${banner.color} rounded-lg overflow-hidden p-5 sm:p-6 flex items-center justify-between min-h-44`}
								style={{
									width: "calc((100% - 9px) / 2.5)",
								}}
							>
								<div className="text-white flex-1">
									<p className="text-xs opacity-80 mb-1.5">
										{banner.brand}
									</p>
									<h2 className="text-lg sm:text-xl font-bold mb-0.5">
										{banner.title}
									</h2>
									<p className="text-sm sm:text-base font-semibold mb-1.5">
										{banner.price}
									</p>
									<p className="text-xs opacity-90 mb-3">
										{banner.subtitle}
									</p>
									<button
										onClick={() => navigate("/collection")}
										className="bg-white text-blue-600 px-3 py-1 rounded font-semibold hover:bg-gray-100 transition text-xs"
									>
										Shop Now
									</button>
								</div>
								<div className="hidden md:block text-4xl opacity-30 ml-2 flex-shrink-0">
									{banner.icon}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Navigation Arrows */}
				<button
					onClick={() =>
						setCurrentBanner(
							(prev) =>
								(prev - 1 + banners.length) % banners.length,
						)
					}
					className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full w-9 h-9 flex items-center justify-center transition z-10 font-bold text-gray-800 shadow-md"
				>
					‹
				</button>
				<button
					onClick={() =>
						setCurrentBanner((prev) => (prev + 1) % banners.length)
					}
					className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full w-9 h-9 flex items-center justify-center transition z-10 font-bold text-gray-800 shadow-md"
				>
					›
				</button>

				{/* Carousel Indicators */}
				<div className="flex justify-center gap-2 mt-3">
					{banners.slice(0, -1).map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentBanner(index)}
							className={`h-2 rounded-full transition ${
								currentBanner === index
									? "bg-gray-800 w-6"
									: "bg-gray-300 w-2"
							}`}
						/>
					))}
				</div>
			</div>

			{/* Secondary Section */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
				<div
					className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer h-48 flex items-center p-6"
					onClick={() => navigate("/collection")}
				>
					<div className="flex-1">
						<p className="text-gray-600 text-sm">Best Selling</p>
						<h3 className="text-2xl font-bold text-gray-900 mt-1">
							Men's Sandals
						</h3>
						<p className="text-blue-600 font-semibold mt-3">
							From ₹129
						</p>
						<p className="text-xs text-gray-500 mt-1">
							Time to shop is now
						</p>
					</div>
					<div className="text-4xl">👟</div>
				</div>

				<div
					className="bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer h-48 flex items-center p-6"
					onClick={() => navigate("/collection")}
				>
					<div className="flex-1">
						<p className="text-gray-400 text-sm">
							Exclusive Launch
						</p>
						<h3 className="text-2xl font-bold text-white mt-1">
							Premium Electronics
						</h3>
						<p className="text-blue-400 font-semibold mt-3">
							Launching Soon
						</p>
						<p className="text-xs text-gray-400 mt-1">
							Best Deals Available
						</p>
					</div>
					<div className="text-4xl">📱</div>
				</div>

				<div
					className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer h-48 hidden lg:flex items-center p-6"
					onClick={() => navigate("/collection")}
				>
					<div className="flex-1">
						<p className="text-blue-100 text-sm">Top Rated</p>
						<h3 className="text-2xl font-bold text-white mt-1">
							Smart ACs
						</h3>
						<p className="text-white font-semibold mt-3">
							From ₹28,990
						</p>
						<p className="text-xs text-blue-100 mt-1">
							Enjoy benefits worth ₹10,730
						</p>
					</div>
					<div className="text-4xl">❄️</div>
				</div>
			</div>
		</div>
	);
};

export default Hero;
