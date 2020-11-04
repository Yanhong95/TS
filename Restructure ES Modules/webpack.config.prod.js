const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production', // 这里是production webpack 才会去minimize code, 做优化等.
  entry: './src/app.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  // 不要source map prod 不需要
  devtool: 'none',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  // extra plugin.
  plugins: [
    // this will help us clean up the dist folder in our case whenever we rebuild our project.
    new CleanPlugin.CleanWebpackPlugin()
  ]
};