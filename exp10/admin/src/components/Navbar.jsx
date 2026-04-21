import React from "react";

const Navbar = ({ setToken }) => {
	return (
		<div className="flex items-center py-2 px-[4%] justify-between">
			<div className="bg-yellow-400 px-5 py-2.5 rounded-lg font-bold text-lg">
				<span className="text-blue-600">L</span>
				<span className="text-black">ICKHILL</span>
			</div>
			<button
				onClick={() => setToken("")}
				className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
			>
				Logout
			</button>
		</div>
	);
};

export default Navbar;
