const path = require('path');

module.exports = {
  // ------------ 以下是 dev server 的 config
  mode: 'development', // 由于这个是dev mode, 他不会做代码缩减和优化我们更好调试.
  // start here to compile
  entry: './src/app.ts',
  output: {
    // absolution path to store compiled file
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    // an additional configuration that is needed for the webpage Dev server to really understand where the output is written to
    // and where does is relative to the index.html file 
    publicPath: 'dist'
  },
   // 告诉webpack按照原本的source-map在bundle.js里也建立这种联系.
  devtool: 'inline-source-map',
  module: {
    // rule is the place to add loader to tell webpack how to deal with certain files.
    // 指定 用某些插件来deal某些文件
    rules: [
      {
        test: /\.ts$/, // 除了node_modules里所有后缀为.ts的文件.
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    // 告诉什么后缀要加在文件中import的后面
    extensions: ['.ts', '.js']
  }
};