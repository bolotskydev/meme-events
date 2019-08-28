const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname, 'src'),
  entry: {
    './events/toBeContinuedMemeEvent/toBeContinuedMemeEvent':
      './events/toBeContinuedMemeEvent/toBeContinuedMemeEvent.js',
    './events/creditsMemeEvent/creditsMemeEvent':
      './events/creditsMemeEvent/creditsMemeEvent.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          compact: true,
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.(mp3|wav|ogg|eot|svg|ttf|woff|woff2|otf)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: (url, resourcePath, context) => {
                return `${path
                  .relative(context, resourcePath)
                  .replace(/\/src/, '')}`
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CleanWebpackPlugin({
      verbose: true,
    }),
    new CopyPlugin([{ from: 'index.js', to: 'index.js', toType: 'file' }]),
  ],
}
