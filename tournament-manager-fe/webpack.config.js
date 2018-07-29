const path = require('path');
const webpack = require('webpack');

const rules = require('./webpack/rules');
const plugins = require('./webpack/plugins');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = env => {
  return {
    entry: {
      main: './src/index.tsx'
    },
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: isProduction ? './' : '/'
    },
    // sets some default plugins like uglify
    mode: isProduction ? 'production' : 'development',
    resolve: {
      extensions: ['.js', '.json', '.ts', '.tsx'],
      alias: {
        // CUSTOM PACKAGES:
        // enables custom paths on import. IMPORTANT!: need to be defined in typescript path also + baseUrl
        '@localization_provider': path.resolve(__dirname, 'src/assets/localization/localizationProvider'),
        '@data_structures': path.resolve(__dirname, 'src/common/dataStructures/'),
        '@enums': path.resolve(__dirname, 'src/common/enums')
       }
    },
    module: {
      rules: rules.getRules(isProduction)
    },
    plugins: plugins.getPlugins(isProduction),
    optimization: isProduction ? {
      minimizer: [new plugins.OptimizeCSSAssetsPlugin({})]
    } : {},
    devServer: {
      contentBase: path.resolve(__dirname, 'src'),
      hot: true
    },
    // node: {
    //   // workaround for webpack-dev-server issue
    //   // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    //   fs: 'empty',
    //   net: 'empty'
    // }
  }
};