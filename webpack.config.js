var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var Minify = require('mini-css-extract-plugin');
var webpack = require('webpack');

module.exports = {
    entry:{
        index:'./src/index.js',
        goodsInfo:'./src/goodsInfo.js',
        payPage:'./src/payPage.js'
    },
    output:{
        //从入口js文件开始所有依赖的模块最终都会打包成输出js文件，或单独打包成css、图片文件，这些打包输出的文件全部放在下方配置的路径里。
        path:path.resolve(__dirname,'dist'),
        filename:'[name].js',
        //帮助最终输出的文件在引用静态资源时能采用正确的路径
        publicPath: 'http://localhost:8080/dist/'//默认在输出的js文件中引用的图片路径是整个工程文件的根目录，
        //当配置publicPath属性后，打包后的js文件中所有通过相对路径引用的资源都会被配置的路径所替换。
        //因此通过如此设置之后打包输出的js文件中引用该图片的路径会在一开始的根目录的路径后面添加publicPath指定的路径
    },
    //设置环境变量，开发环境不压缩输出文件，生产环境压缩输出文件
    mode:'development',
    // 配置服务器
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: true,
        hot: true,
        compress: true,
        host: 'localhost',
        port: 8080
    },
    module:{
        //loader工作原理：只能处理与入口js文件有依赖的模块
        rules:[
            //css loader
            {
                test:/\.css$/,
                //将css打包进输出js文件写法
                // use:['style-loader','css-loader']
                //将css单独打包写法,与插件配合
                use:[Minify.loader,'css-loader']
            },
            //less loader
            {
                test: /\.less$/, 
                use: [Minify.loader, 'css-loader', 'less-loader']
            },
            //html loader(只能处理与入口js文件有依赖关系的html文件)
            // {
            //     test:/\.html$/,
            //     use:[
            //         //最后对抽离出的html文件进行配置(文件名等)
            //         {
            //             loader:'file-loader',
            //             options:{
            //                 //配置文件名
            //                 name:'[name].html'
            //             }
            //         },
            //         //再单独抽离出html文件
            //         {
            //             loader:'extract-loader'
            //         },
            //         //先找到html文件进行解析
            //         {
            //             loader:'html-loader'
            //         }
            //     ]
            // },
            //js loader
            // {
            //     test:/\.js$/,
            //     use:['babel-loader']
            // },
            //img loader
            {
                test:/\.(jpg|png|gif|svg)$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:8192,
                            name:'[name].[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        //根据模板单独打包html文件，不必是入口js文件依赖的html文件
        new HtmlWebpackPlugin({
            // title:'title',
            filename:'index.html',
            template:'./index.html',
            chunks:['index']
            // minify:{
            //     //压缩空白
            //     collapseWhitespace:true
            // }
        }),
        new HtmlWebpackPlugin({
            // title:'title',
            filename:'goodsInfo.html',
            template:'./goodsInfo.html',
            chunks:['goodsInfo']
        }),
        new HtmlWebpackPlugin({
            // title:'title',
            filename:'payPage.html',
            template:'./payPage.html',
            chunks:['payPage']
        }),
        //压缩js文件
        new UglifyJSPlugin(),
        //单独打包css文件
        new Minify({
            filename:'[name]_[contenthash:8].css'
        }),
        //引用jquery
        new webpack.ProvidePlugin({$: 'jquery', jQuery: 'jquery'})
    ]
}
