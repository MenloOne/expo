/* eslint max-len: 0 */

import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import SWPrecacheWebpackPlugin from 'sw-precache-webpack-plugin'

import baseConfig from './base.config'

const appName = require('../../package.json').name
const path = require('path')
const glob = require('glob-all')

export default {
  ...baseConfig,
  module: {
    rules: [
      ...baseConfig.module.rules,
      {
        test: /\.(woff|woff2|eot|ttf)(\?v=[0-9].[0-9].[0-9])?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[sha512:hash:base64:7].[ext]'
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              query: {
                name: '[sha512:hash:base64:7].[ext]'
              }
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: (webpackInstance) => [
                  require('postcss-import')({ addDependencyTo: webpackInstance }),
                  require('postcss-url')(),
                  require('precss')(),
                  require('autoprefixer')({ browsers: [ 'last 2 versions' ] })
                ]
              }
            }
          ]
        }),
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    // extract css
    new ExtractTextPlugin({
      filename: '[name]-[chunkhash].css',
      allChunks: true
    }),

    // set env
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify('production')
      }
    }),

    // optimizations
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false,
        screw_ie8: true,
        sequences: true,
        dead_code: true,
        drop_debugger: true,
        comparisons: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        if_return: true,
        join_vars: true,
        cascade: true,
        drop_console: true
      },
      output: {
        comments: false
      }
    }),
    new SWPrecacheWebpackPlugin(
      {
        cacheId: `${appName}-sw`,
        filename: 'serviceWorker.js',
        maximumFileSizeToCacheInBytes: 4194304,
        runtimeCaching: [ {
          urlPattern: /\//,
          handler: 'fastest'
        } ]
      }
    ),

    ...baseConfig.plugins
  ]
}
