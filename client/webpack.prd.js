// mostly based on https://webpack.js.org/guides/production/

const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
	mode: "production",
	devtool: "source-map",
});
