const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 8080,
    open: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    watchFiles: ['index.html', 'src/**/*'],
  },
});
