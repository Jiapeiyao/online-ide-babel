const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const distPath = path.resolve(__dirname, "dist");

const postcssLoaderOptions = {
    plugins: [require('autoprefixer')],
    javascriptEnabled: true,
};

const config = {
    entry: ["./src/index.tsx"],
    output: {
        path: distPath,
        filename: "app.js",
    },
    devServer: {
        contentBase: distPath,
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: postcssLoaderOptions,
                    },
                ],
                exclude: /\.module\.css$/,
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: true,
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: postcssLoaderOptions,
                    },
                ],
                include: /\.module\.css$/,
            },
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"],
            },
            {
                test: /\.(png|svg|jpg|gif|ttf)$/,
                use: "url-loader?limit=100000",
            },
        ],
    },
    externals: [
        {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'antd': 'antd',
        },
        /^(antd|react|react\-dom)(\/[a-z0-9]*)*$/i,
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html'),
            inject: true,
            appMountId: "app",
            filename: "index.html",
        }),
        new MonacoWebpackPlugin({
            // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
            languages: ['typescript', 'javascript', 'less', 'typescriptreact']
        })
    ],
};

module.exports = (env, argv) => {
    return config;
};
