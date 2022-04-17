var path = require('path');

module.exports = {
    mode: "production",

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
        },
        // https://github.com/firebase/firebase-tools/issues/1676#issuecomment-698042925
        proxy: {
            '/__/': {
                target: 'http://localhost:5000', // default hosting emulator port
            },
            '/api/': {
                target: 'http://localhost:5001', // some other api
            },
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
        removeAvailableModules: false,
        // removeEmptyChunks: false,
        // splitChunks: false,
    }
};

