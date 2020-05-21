const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const distPath = path.resolve(__dirname, 'dist');

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: [require('autoprefixer')],
    javascriptEnabled: true,
  },
};

const tsLoader = {
  loader: 'ts-loader',
  options: {
    happyPackMode: true,
  },
};

const config = {
  entry: {
    app: './src/index.tsx',
  },
  output: {
    path: distPath,
    filename: '[name].js',
  },
  devServer: {
    contentBase: distPath,
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts)$/,
        use: ['thread-loader', tsLoader],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif|ttf)$/,
        use: 'url-loader?limit=100000',
      },
    ],
  },
  externals: [
    {
      react: 'React',
      'react-dom': 'ReactDOM',
      antd: 'antd',
      '@babel/standalone': 'Babel',
    },
    /^(antd|react|react\-dom)(\/[a-z0-9]*)*$/i,
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      inject: true,
      appMountId: 'app',
      filename: 'index.html',
    }),
    new MonacoWebpackPlugin({
      // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      languages: ['typescript', 'less'],
      // features: ['accessibilityHelp', 'bracketMatching', 'caretOperations', 'clipboard', 'codeAction', 'codelens', 'colorDetector', 'comment', 'contextmenu', 'coreCommands', 'cursorUndo', 'dnd', 'find', 'folding', 'fontZoom', 'format', 'gotoError',  'gotoLine', 'gotoSymbol', 'hover', 'iPadShowKeyboard', 'inPlaceReplace', 'inspectTokens', 'linesOperations', 'links', 'multicursor', 'parameterHints', 'quickCommand', 'quickOutline', 'referenceSearch', 'rename', 'smartSelect', 'snippets', 'suggest', 'toggleHighContrast', 'toggleTabFocusMode', 'transpose', 'wordHighlighter', 'wordOperations', 'wordPartOperations']
    }),
  ],
};

module.exports = (env, argv) => {
  return config;
};
