var webpack = require("webpack")

module.exports = {
    devtool: 'source-map',

    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.jsx']
    },

    entry: [
        './tests/index.js',
        'webpack-dev-server/client?http://0.0.0.0:3000',
        'webpack/hot/only-dev-server'
    ],

    output: {
        path: __dirname + "/tests/build/",
        filename: "bundle.js",
        publicPath: "/tests/build/"
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],

    module: {
        loaders: [
            {
                test: /\.js.*$/,
                loaders: ['babel?stage=0&optional[]=runtime'],
                exclude: /node_modules/
            },
            {
                test: /\.(css)$/,
                loaders: ['style-loader', 'css-loader', 'autoprefixer-loader']
            },
            {
                test: /\.json$/,
                loaders: ['json-loader']
            }
        ]
    }
};