const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

// Webpack Configuration
const config = {
    devtool: 'inline-source-map',
    entry: "./src/index.ts",

    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "[name].bundle.js",
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: ["ts-loader"],
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },

    resolve: {
        extensions: [".ts", ".js"],
    },

    plugins: [
        new htmlWebpackPlugin({
            filename: "index.html",
            title: "Ski Game",
            template: "src/index.html",
        }),
        new CopyPlugin({
            patterns: [{ from: "img/*", to: "" }],
        }),
    ],
};

module.exports = config;
