const path = require('path');

module.exports = {
    mode: "development",

    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',

    devServer: {
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        },
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        proxy: {
            '/__': 'http://localhost:5000',
        },
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".js", ".ts", ".tsx"]
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },

    output: {
        publicPath: '/',
        filename: 'main.js',
    },
    optimization: {
        // minimize: false,
        // removeAvailableModules: false,
        // removeEmptyChunks: false,
        // splitChunks: false,
    }
};

