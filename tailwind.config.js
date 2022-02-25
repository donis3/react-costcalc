const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			animation: { 'spin-slow': 'spin 2s linear infinite' },
			fontFamily: {
                sans: ["Poppins", ...defaultTheme.fontFamily.sans],
            }
			
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
