import React from "react";

const OurPolicy = () => {
	return (
		<div className="w-full py-12 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
				<div className="bg-blue-50 rounded-lg p-6 text-center hover:shadow-lg transition">
					<div className="text-4xl mb-4">🚚</div>
					<p className="font-bold text-lg text-gray-800 mb-2">
						Free Shipping
					</p>
					<p className="text-sm text-gray-600">
						On orders above ₹500
					</p>
				</div>

				<div className="bg-green-50 rounded-lg p-6 text-center hover:shadow-lg transition">
					<div className="text-4xl mb-4">↩️</div>
					<p className="font-bold text-lg text-gray-800 mb-2">
						Easy Returns
					</p>
					<p className="text-sm text-gray-600">
						7 days return policy
					</p>
				</div>

				<div className="bg-yellow-50 rounded-lg p-6 text-center hover:shadow-lg transition">
					<div className="text-4xl mb-4">🔄</div>
					<p className="font-bold text-lg text-gray-800 mb-2">
						Easy Exchange
					</p>
					<p className="text-sm text-gray-600">
						Hassle-free exchanges
					</p>
				</div>

				<div className="bg-red-50 rounded-lg p-6 text-center hover:shadow-lg transition">
					<div className="text-4xl mb-4">💬</div>
					<p className="font-bold text-lg text-gray-800 mb-2">
						24/7 Support
					</p>
					<p className="text-sm text-gray-600">
						Best customer service
					</p>
				</div>
			</div>
		</div>
	);
};

export default OurPolicy;
