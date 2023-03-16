import * as path from 'path';
import webpackNodeExternals from 'webpack-node-externals';
import { Configuration, HotModuleReplacementPlugin } from 'webpack';

const webpackConfig: Configuration = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  externalsPresets: { node: true },
  externals: [webpackNodeExternals()],
  plugins: [new HotModuleReplacementPlugin()],
  module: {
    rules: [
      {
        exclude: /node_modules/,
        use: 'ts-loader',
        test: /\.ts$/,
      },
    ],
  },
};

export default webpackConfig;
