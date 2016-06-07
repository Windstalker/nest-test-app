var webpack = require('webpack');
var yargs = require('yargs');
var path = require('path');
var autoprefixer = require('autoprefixer');

module.exports = {
  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack-hot-middleware/client',
    path.join(__dirname, 'src', 'index.js')
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    sourceMapFilename: 'bundle.map',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /\/node_modules\//,
        include: path.join(__dirname, 'src'),
        loader: 'babel',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      },
      // Styles
      {
        test: /\.scss$/,
        loader: 'style!css!postcss!sass'
      },
      {
        test: /\.css$/,
        loader: 'style!css!postcss'
      },
      {test: /\.html$/, loader: 'html'},
      {test: /\.json$/, loader: 'json'},
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url?limit=10000&name=images/[name].[ext]'
      },

      {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]'},
      {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff2&name=fonts/[name].[ext]'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream&name=fonts/[name].[ext]'},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file?name=fonts/[name].[ext]'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml&name=fonts/[name].[ext]'}
    ]
  },
  postcss: [autoprefixer({ browsers: ['last 2 versions'] })],

  resolve: {
    extensions: ['', '.js'],
    root: [path.join(__dirname, 'src')],
    modules: ['src', 'node_modules']
  },

  target: 'web',
  devtool: 'inline-source-map',

  stats: {
    colors: true
  }
};
