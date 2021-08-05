/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
	mount: {
		public: { url: '/', static: true },
		src: { url: '/dist' },
	},
	plugins: ['@snowpack/plugin-react-refresh', '@snowpack/plugin-webpack'],
	devOptions: {
		port: 3001,
	},
}
