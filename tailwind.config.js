module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {},
	},
	// add daisyUI plugin
	plugins: [require('daisyui')],

	// config (optional)
	daisyui: {
		styled: true,
		//First theme is default
		//Add themes to config/config.json too.
		themes: ['emerald', 'light', 'dark', 'cupcake', 'bumblebee'],
		base: true,
		utils: true,
		logs: true,
		rtl: false,
	},
};
