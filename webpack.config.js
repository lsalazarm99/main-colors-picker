const path = require('path');

const config = {
  mode: 'development',
  target: 'web',
  entry: './src/main-colors-picker.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'main-colors-picker.js',
    path: path.resolve(__dirname, './dist'),
    library: 'MainColorsPicker',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
};

module.exports = config;
