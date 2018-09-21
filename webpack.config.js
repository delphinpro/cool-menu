const path           = require('path');
const webpack        = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const pkg            = require('./package.json');

const banner = `Cool Menu
@author      ${pkg.author}
@copyright   copyright © 2017—2018 delphinpro
@license     licensed under the ${pkg.license} license
@version     ${pkg.version}

https://github.com/delphinpro/cool-menu`;

if (!process.env.NODE_ENV) {
    console.warn('process.env.NODE_ENV undefined! Default set as \'production\'!');
    process.env.NODE_ENV = 'production';
}

const DEV_MODE = process.env.NODE_ENV !== 'production';
console.warn('DEVELOPMENT MODE:', DEV_MODE ? 'ON' : 'OFF');

module.exports = {
    entry: './src/cool-menu.js',

    watch: DEV_MODE,

    output: {
        path         : path.join(__dirname, 'dist'),
        filename     : 'cool-menu.js',
        // library      : 'CoolMenu',
        libraryTarget: 'umd',
    },

    module: {
        rules: [
            {
                test  : /\.js$/,
                loader: 'babel-loader',
            },
        ],
    },

    resolve: {
        modules   : ['node_modules'],
        extensions: ['.js'],
    },

    plugins: [
        new UglifyJsPlugin({
            sourceMap    : false,
            parallel     : true,
            uglifyOptions: {
                warnings: false,
                output  : {
                    comments: /^\**!|@preserve/,
                },
            },
        }),

        new webpack.BannerPlugin({
            banner,
        }),
    ],

    context: __dirname,

    target: 'web',
};
