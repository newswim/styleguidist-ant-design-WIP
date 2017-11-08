const DashboardPlugin = require('webpack-dashboard/plugin')
const { NODE_ENV, WEB_PORT } = process.env
const isProd = NODE_ENV === 'production'

let dev_config = {
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:' + (WEB_PORT ? WEB_PORT : 3000),
    'webpack/hot/only-dev-server',
    './index.js'
  ],
  devtool: 'eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    // new webpack.ContextReplacementPlugin(/\.\/locale$/, "empty-module", false, /js$/),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        API_KEY: JSON.stringify(process.env.API_KEY),
        API_BASE_PATH: JSON.stringify(process.env.API_BASE_PATH) || 'http://localhost:3000'
      }
    })
    // new BundleAnalyzerPlugin()
  ]
}

let prodConfig = {
  entry: ['./index.js'],
  devtool: 'cheap-module-source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      uglifyOptions: {
        ie8: false,
        ecma: 6,
        mangle: true,
        output: {
          beautify: false,
          comments: false
        },
        compress: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        API_KEY: JSON.stringify(process.env.API_KEY),
        API_BASE_PATH: JSON.stringify(process.env.API_BASE_PATH)
      }
    })
  ]
}

module.exports = () => {
  return {
    context: resolve(__dirname, 'src'),
    devtool: isProd ? prodConfig.devtool : devConfig.devtool,
    devServer: {
      disableHostCheck: true,
      hot: true,
      contentBase: resolve(__dirname, 'dist'),
      // historyApiFallback: true, // as per http://redux.js.org/docs/advanced/UsageWithReactRouter.html
      port: WEB_PORT ? WEB_PORT : 8080,
      publicPath: '/',
      headers: { origin: '*' }
    },
    entry: isProd ? prodConfig.entry : devConfig.entry,
    output: {
      filename: 'bundle.js',
      path: resolve(__dirname, 'dist'),
      publicPath: '/'
    },
    // NOTE: This might not be needed ->
    resolve: {
      extensions: ['.js', '.jsx']
    },
    plugins: [new DashboardPlugin()],
    module: {
      rules: [
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
        },
        {
          // Matches both JavaScript and JSX
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: ['@babel/preset-env', 'react'],
              plugins: [
                '@babel/proposal-object-rest-spread',
                'transform-class-properties',
                ['import', { libraryName: 'antd', style: true }]
              ]
            }
            // options: {
            //   babelrc: false,
            //   presets: [['es2015', { modules: false }], 'stage-2', 'react'],
            //   plugins: [
            //     'react-hot-loader/babel',
            //     'transform-react-jsx',
            //     'transform-class-properties',
            //     [
            //       'transform-imports',
            //       {
            //         antd: {
            //           transform: 'antd/lib/${member}',
            //           preventFullImport: true,
            //           kebabCase: true
            //         },
            //         lodash: {
            //           transform: 'lodash/${member}',
            //           preventFullImport: true
            //         }
            //       }
            //     ]
            //   ]
            // }
          }
        }
      ]
    }
  }
}
