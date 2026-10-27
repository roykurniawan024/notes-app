const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      templateContent: () =>
        fs
          .readFileSync(path.resolve(__dirname, 'index.html'), 'utf8')
          .replace('<link rel="stylesheet" href="src/styles/style.css" />', '')
          .replace('<script type="module" src="src/scripts/app.js"></script>', ''),
    }),
  ],
};
