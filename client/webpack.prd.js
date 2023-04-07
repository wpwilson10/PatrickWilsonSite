// mostly based on https://webpack.js.org/guides/production/

const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const Dotenv = require("dotenv-webpack");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = merge(common, {
	mode: "production",
	devtool: "source-map",
	plugins: [
		new Dotenv({
			path: "./prd.env",
		}),
		new CompressionPlugin(),
	],
});
