const path = require('path');

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const getPath = (...p) => path.resolve(process.cwd(), ...p);

module.exports = {
  mode: 'production',
  entry: getPath('src', 'index.ts'),
  output: {
    libraryTarget: 'system',
    filename: 'elui.production.js',
    path: getPath('dist', 'system'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    plugins: [new TsconfigPathsPlugin()],
  },
  externals: ['react', 'react-dom'],
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' },
      {
        test: /\.(m?js|jsx|tsx|ts)$/,
        include: getPath('src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
            },
          },
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /@babel(?:\/|\\{1,2})runtime/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          configFile: false,
          compact: false,
          presets: [['babel-preset-react-app/dependencies', { helpers: true }]],
          cacheDirectory: true,
          cacheCompression: false,
        },
      },
    ],
  },
};
