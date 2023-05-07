// mostly based on https://webpack.js.org/guides/production/

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	entry: "./src/index.tsx",
	output: {
		filename: "[name].[contenthash].js",
		path: path.resolve(__dirname, "dist"),
		clean: true,
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "patrickwilson.site",
			template: "./public/index.html",
		}),
		new MiniCssExtractPlugin({
			filename: "[name].[contenthash].css",
		}),
		// Copy favicons and other files to dist (the default)
		new CopyPlugin({
			patterns: [
				{ from: "./public/favicons" },
				{ from: "./public/robots.txt" },
				{ from: "./public/site.webmanifest" },
			],
		}),
	],
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			// Allow loading images
			// https://webpack.js.org/guides/asset-management/#loading-images and https://stackoverflow.com/a/66251201
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource",
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
			},
		],
	},
};
