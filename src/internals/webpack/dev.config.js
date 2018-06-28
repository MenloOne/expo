import webpack from 'webpack'
import path from 'path'
import { isArray } from 'lodash'

import baseConfig from './base.config'
import startKoa from './utils/start-koa'

const { VIRTUAL_HOST, C9_HOSTNAME } = process.env

const LOCAL_IP = require('dev-ip')()

const PORT = C9_HOSTNAME ? '443' : parseInt(process.env.PORT, 10) + 1 || 3001

const HOST =
  VIRTUAL_HOST || C9_HOSTNAME || (isArray(LOCAL_IP) && LOCAL_IP[0]) || LOCAL_IP || 'localhost'

const PUBLIC_PATH = `//${HOST}:${PORT}/assets/`

export default {
  server: {
    port: PORT,
    options: {
      publicPath: C9_HOSTNAME ? '/' : PUBLIC_PATH,
      hot: true,
      stats: {
        assets: true,
        colors: true,
        version: false,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false
      }
    }
  },
  context: path.join(__dirname, '..', '..'),
  webpack: {
    ...baseConfig,
    context: path.join(__dirname, '..', '..'),
    devtool: 'cheap-module-source-map',
    entry: {
      app: [ `webpack-hot-middleware/client?path=//${HOST}:${PORT}/__webpack_hmr`, './app/index.js' ]
    },
    output: { ...baseConfig.output, publicPath: PUBLIC_PATH },
    module: {
      ...baseConfig.module,
      rules: [
        ...baseConfig.module.rules,
        {
          test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf)(\?v=[0-9].[0-9].[0-9])?$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[sha512:hash:base64:7].[ext]'
            }
          },
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
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
          ],
          exclude: /node_modules/
        },
        {
          test: /\.md$/,
          use: [
            {
              loader: 'html-loader'
            },
            {
              loader: 'markdown-loader',
              options: {
                pedantic: true
              }
            }
          ]
        }
      ]
    },
    plugins: [
      // hot reload
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),

      new webpack.DefinePlugin({
        'process.env': {
          BROWSER: JSON.stringify(true),
          NODE_ENV: JSON.stringify('development')
        }
      }),

      ...baseConfig.plugins,
      function onDone() {
        this.plugin('done', startKoa)
      }
    ]
  }
}
