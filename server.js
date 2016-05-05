var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var config = require("./webpack.debug.config.js");

var host = '0.0.0.0';
var port = 3000;

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    historyApiFallback: true,
    hot: true
}).listen(port, host, function(err, result) {
    if(err) {
        console.log(err);
    }

    console.log('listening at ' + host + ":" + port);
});