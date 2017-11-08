module.exports = () => {
  return {
    module: {
      rules: [
        {
          // JavaScript
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['import', { libraryName: 'antd', style: true }]
            }
          }
        }
      ]
    }
  }
}
