/* eslint-disable global-require */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackInsertAssestListPlugin = require('./HtmlWebpackInsertAssestListPlugin');

const BASE_PATH = __dirname;
const DIST_PATH = path.resolve(__dirname, 'dist');
const SRC_PATH = path.resolve(__dirname, 'src');
const SANDBOX_PATH = path.resolve(SRC_PATH, 'sandbox');
const PUBLIC_PATH = path.resolve(__dirname, 'public');
const NODE_MODULES_PATH = path.resolve(__dirname, 'node_modules');

const { sandboxEntryMap } = require('./src/sandbox/entry_list');

module.exports = (env, options) => {
  const isDevMode = options.mode === 'development';
  const publicPath = isDevMode ? 'http://localhost:8080' : 'http://localhost:5500';
  return {
    devtool: isDevMode ? 'source-map' : false,
    resolve: {
      alias: {},
      extensions: ['.ts', '.tsx', '.js'],
      fallback: {
        fs: false,
        tls: false,
        net: false,
        path: false,
        zlib: false,
        http: false,
        https: false,
        stream: false,
        crypto: false,
        vm: false,
        // 'crypto-browserify': require.resolve('crypto-browserify'),
      },
    },
    entry: {
      app: path.join(SRC_PATH, 'index.tsx'),
      ...sandboxEntryMap,
    },
    output: {
      path: DIST_PATH,
      filename: '[name].[fullhash].js',
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    optimization: {
      splitChunks: {
        chunks: (chunk) => chunk.name === 'app',
        name: 'vendor',
      },
    },
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: { loader: 'worker-loader' },
        },
        {
          test: /\.txt|\.raw\.js$/,
          use: 'raw-loader',
        },
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.scss|\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDevMode,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('autoprefixer')(),
                  ],
                },
                sourceMap: isDevMode,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDevMode,
              },
            },
          ],
        },
        {
          test: /\.(ttf|eot|woff|woff2)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
            },
          },
        },
        {
          test: /\.(jpe?g|png|gif|svg|ico)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'assets/',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(PUBLIC_PATH, 'index.html'),
        filename: path.join(DIST_PATH, 'index.html'),
        publicPath,
        chunks: ['app', 'vendor'],
      }),
      new HtmlWebpackPlugin({
        template: path.join(PUBLIC_PATH, 'sandbox.html'),
        filename: path.join(DIST_PATH, 'sandbox.html'),
        chunks: ['sandbox.worker'],
      }),
      new HtmlWebpackInsertAssestListPlugin(),
      ...(isDevMode ? [] : [new BundleAnalyzerPlugin()]),
    ],
    devServer: {
      historyApiFallback: true,
      publicPath,
    },
    performance: {
      hints: false,
    },
  };
};
