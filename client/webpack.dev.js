// mostly based on https://webpack.js.org/guides/production/

const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const Dotenv = require("dotenv-webpack");

module.exports = merge(common, {
	mode: "development",
	devtool: "inline-source-map",
	plugins: [
		new Dotenv({
			path: "./dev.env",
		}),
	],
});
