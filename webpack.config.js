

module.exports = {
    resolve: {
        modulesDirectories: ['node_modules']
    },

    entry: [
        './src/streamteam.js'
    ],

    output: {
        path: '.',
        filename: 'index.js',
        library: 'streamteam',
        libraryTarget: 'umd'
    },

    externals: {
        d3: true
    },
    
    module: {
        loaders: [
            {
                test: /\.js.*$/,
                loaders: ['babel?stage=0&optional[]=runtime'],
                exclude: /node_modules/
            }
        ]
    }
};