const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'

console.log(`Running webpack in ${isDev ? 'development' : 'production'} mode`)

module.exports = {
  entry: {
    core: './app/frontend/css/index.js',
    monitor: './app/frontend/js/live-monitor.js'
  },
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.(?:s[ac]|c)ss$/i,
        use: [
          'style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
              esModule: false
            }
          },
          'css-loader',
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev,
              sassOptions: {
                outputStyle: 'compressed'
              }
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'images/'
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'fonts/'
          }
        }
      }
    ]
  },
  output: {
    filename: 'js/[name].[fullhash].js',
    path: path.resolve(__dirname, 'app/dist'),
    library: '[name]'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      filename: '../views/_layout.njk',
      template: 'app/views/_layout.template.njk',
      chunks: ['core']
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: '../views/live-monitor.njk',
      template: 'app/views/_live-monitor.template.njk',
      chunks: ['monitor']
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[fullhash].css'
    })
  ]
}
