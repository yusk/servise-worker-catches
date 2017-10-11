const path = require('path')
const webpack = require('webpack')

const rootDir = path.resolve(__dirname, '../..')
const outputPath = path.resolve(rootDir, 'build/client')
const outputPublicPath = '/public/'

module.exports = {
  name: 'client',
  target: 'web',
  context: rootDir,
  entry: [
    path.resolve(rootDir, 'src/client/index.js')
  ],
  output: {
    path: outputPath,
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: outputPublicPath,
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve(rootDir, 'src/client'),
      path.resolve(rootDir, 'src/shared'),
      'node_modules',
    ],
    extensions: ['.js', '.jsx']
  },
}
