const defaultTheme = require('tailwindcss/defaultTheme');

//Will include all grid sizes and add them to safelist for dynamic class building
function getAllCols() {
	const sizes = ['md', 'lg', 'xl'];
	const columns = [];

	for (let i = 1; i <= 12; i++) {
		//Push size independent class
		columns.push(`grid-cols-${i}`);

		//Push for each size qury
		sizes.forEach((size) => {
			columns.push(`${size}:grid-cols-${i}`);
		});
	}
	return columns;
}

module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	//Always compiled classes
	safelist: ['bg-red-500', ...getAllCols()],
	theme: {
		extend: {
			animation: { 'spin-slow': 'spin 2s linear infinite' },
			fontFamily: {
				sans: ['Poppins', ...defaultTheme.fontFamily.sans],
			},
		},
	},
	// add daisyUI plugin
	plugins: [require('daisyui')],

	// config (optional)
	daisyui: {
		styled: true,
		//First theme is default
		//Add themes to config/config.json too.
		//themes: ['emerald', 'light', 'dark', 'cupcake', 'bumblebee'],
		themes: require('./src/config/config.json').themes, //Import from app custom config
		base: true,
		utils: true,
		logs: true,
		rtl: false,
	},
};
