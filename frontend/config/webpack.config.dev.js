'use strict';

const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const paths = require('./paths');
const { CheckerPlugin } = require('awesome-typescript-loader')

// Determine where the app is being served from.
const publicPath = 'http://localhost:4001/';

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    vendor: [
      'phoenix_html',
      'react',
      'react-dom',
      'moment',
      '@blueprintjs/core'
    ],
    app: [
      require.resolve('webpack-dev-server/client') + '?' + publicPath,
      require.resolve('webpack/hot/dev-server'),
      require.resolve('./polyfills'),
      require.resolve('react-error-overlay'),
      paths.appIndexTs
    ]
  },
  output: {
    path: paths.appBuild,
    pathinfo: true,
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].[id].chunk.js',
    publicPath: publicPath,
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath)
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.json', '.jsx'],
    plugins: [
      // Prevents users from importing files from outside of src/ (or node_modules/).
      new ModuleScopePlugin(paths.appSrc)
    ]
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.js$/,
        loader: require.resolve('source-map-loader'),
        enforce: 'pre',
        include: paths.appSrc
      },
      // Compile .tsx?
      {
        test: /\.(ts|tsx)$/,
        include: paths.appSrc,
        use: [
          {
            loader: require.resolve('awesome-typescript-loader'),
            options: {
              useBabel: true,
              useCache: true
            }
          }
        ]
      },
      {
        loader: require.resolve('file-loader'),
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.(ts|tsx)$/,
          /\.css$/,
          /\.scss$/,
          /\.json$/,
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/
        ],
        options: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          require.resolve('css-loader')
        ]
      },
      {
        test: /\.scss$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1
            }
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9' // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009'
                })
              ]
            }
          },
          require.resolve('sass-loader')
        ]
      }
    ]
  },
  plugins: [
    // Makes some environment variables available to the JS code
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    // Necessary to emit hot updates
    new webpack.HotModuleReplacementPlugin(),
    // Prints error if mistype casing a path
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    // Ignore MomentJS locale
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: Infinity
    }),
    new CheckerPlugin()
  ],
  // Empty mocks Node standard library modules
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  performance: {
    hints: false
  }
};
