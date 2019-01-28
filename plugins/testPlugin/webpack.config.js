const path = require("path");

const outputFolder = "dist";
module.exports = {
    entry: {
        index: "./src/main.ts",
    },
    output: {
        path: path.join(__dirname, outputFolder),
        filename: 'plugin.js'
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js" , ".jsx"]
    },
    module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: "ts-loader"
          },
        ]
    },
    target: "electron-renderer",
    externals:[
        "react"
    ]
};