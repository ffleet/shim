const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'lib');
const SRC_DIR = path.resolve(__dirname, 'src');

module.exports = (env = {}) => {
  return {
    entry: {
      index: [SRC_DIR + '/index.js']
    },
    output: {
      path: BUILD_DIR,
      filename: '[name].js',
      libraryTarget: 'commonjs2'
    },
    target: 'node',
    node: {
      Buffer: false,
      process: false,
      global: false,
      __filename: false,
      __dirname: false,
      setImmediate: false,
      console: false,
    },
	optimization: {
		minimize: true
	},
    //devtool: 'source-map',//env.prod ? 'source-map' : 'cheap-module-eval-source-map',
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules\/(?!aws-serverless-express)/,
          use: {
            loader: 'babel-loader'
          }
        },
      ]
    },
    plugins: [
      //new webpack.NamedModulesPlugin(),
    ]
  }
};
