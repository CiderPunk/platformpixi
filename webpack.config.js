const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
 
    // this is our output file, the one which bundles all libraries
    filename: 'main.js',

    // and this is the path of the output bundle, "dist" folder
    path: path.resolve(__dirname, 'dist'),
},
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                // options...
              }
            }
          ]
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ],
  },
  target:"web",
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/styles.css'
    }),
  ]
};