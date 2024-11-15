const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

// Webpack Configuration
const config = {
    devtool: 'inline-source-map',
    entry: {
        oldGame: "./src/OldGame/index.ts",
        newGame: "./src/NewGame/index.ts",
    },

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
            title: "Ceros Ski",
            template: "src/index.html",
            chunks: ["oldGame"],
        }),
        new htmlWebpackPlugin({
            filename: "newGame.html",
            title: "Ceros Ski new",
            template: "src/index.html",
            chunks: ["newGame"],
        }),
        new CopyPlugin({
            patterns: [{ from: "img/*", to: "" }],
        }),
    ],
};

module.exports = config;
