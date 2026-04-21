import React from "react";

const Footer = () => {
	return (
		<div>
			<div className="bg-gray-900 text-white">
				<div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-12">
					<div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10">
						<div>
							<h1 className="text-2xl font-bold mb-4">
								LICKHILL
							</h1>
							<p className="w-full md:w-2/3 text-gray-300">
								LICKHILL is your premier destination for quality
								fashion and trending styles. We bring you the
								latest collections designed to make you feel
								confident and stylish. From casual wear to
								premium fashion, we have something for everyone.
							</p>
						</div>

						<div>
							<p className="text-lg font-bold mb-4">COMPANY</p>
							<ul className="flex flex-col gap-2 text-gray-300">
								<li className="hover:text-yellow-400 cursor-pointer transition">
									Home
								</li>
								<li className="hover:text-yellow-400 cursor-pointer transition">
									About Us
								</li>
								<li className="hover:text-yellow-400 cursor-pointer transition">
									Delivery Info
								</li>
								<li className="hover:text-yellow-400 cursor-pointer transition">
									Privacy Policy
								</li>
							</ul>
						</div>

						<div>
							<p className="text-lg font-bold mb-4">
								GET IN TOUCH
							</p>
							<ul className="flex flex-col gap-2 text-gray-300">
								<li>📞 +91-9876-543-210</li>
								<li>✉️ hello@lickhill.com</li>
								<li>📍 Follow us on social media</li>
							</ul>
						</div>
					</div>

					<div className="border-t border-gray-700">
						<p className="py-5 text-sm text-center text-gray-400">
							Copyright © 2025 LICKHILL.com - All Rights Reserved.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Footer;
