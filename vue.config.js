const CompressionWebpackPlugin = require('compression-webpack-plugin')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const forElementUI = require('webpack-theme-color-replacer/forElementUI')
const { chain, set, each } = require('lodash')

// 拼接路径
const resolve = dir => require('path').join(__dirname, dir)

// 增加环境变量
process.env.VUE_APP_VERSION = require('./package.json').version
// 基础路径 注意发布之前要先修改这里
const publicPath = process.env.VUE_APP_PUBLIC_PATH || '/'

// 多页配置，默认未开启，如需要请参考 https://cli.vuejs.org/zh/config/#pages
const pages = undefined

// const pages = {
//   index: './src/main.js',
//   subpage: './src/subpage.js'
// }

module.exports = {
  // 根据实际情况更改这里
  publicPath,
  outputDir:'jxtEcdist',
  lintOnSave: true,
  devServer: {
    publicPath, // 和 publicPath 保持一致
    host: 'localhost',
    port: "9538", // 代理端口
    https: false,
    hotOnly: true, // 热更新
    proxy: {
        '/JxtEcInterface': {
            target: process.env.VUE_APP_API_PATH, // 测试地址
            secure: false,
            changeOrigin: true,
            ws: true,
            pathRewrite: {
                '^/JxtEcInterface': '/'
            }
        },
        '/static': {
            target: process.env.VUE_APP_API_IMG, // 测试地址
            secure: false,
            changeOrigin: true,
            ws: true,
            pathRewrite: {
                '^/static': '/'
            }
        }
    },
    disableHostCheck: process.env.NODE_ENV === 'development' // 关闭 host check，方便使用 ngrok 之类的内网转发工具
  },
  css: {
    loaderOptions: {
      // 设置 scss 公用变量文件
      sass: {
        prependData: '@import \'~@/assets/style/public.scss\';'
      }
    }
  },
  pages,
  configureWebpack: config => {
    const configNew = {}
    if (process.env.NODE_ENV === 'production') {
      configNew.plugins = [
        // gzip
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false
        })
      ]
    }
    return configNew
  },
  transpileDependencies: [
    'vue-echarts',
    'resize-detector',
    'vue-baidu-map'
  ],
  // 默认设置: https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js
  chainWebpack: config => {
    /**
     * 删除懒加载模块的 prefetch preload，降低带宽压力
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
     * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
     */
    config.entry('main').add('babel-polyfill')
    config.plugins
      .delete('prefetch')
      .delete('preload')
    // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
    config.resolve
      .symlinks(true)
      console.log(process.env.VUE_APP_ELEMENT_COLOR,'VUE_APP_ELEMENT_COLOR')
    config
      .plugin('theme-color-replacer')
      .use(ThemeColorReplacer, [{
        fileName: process.env.NODE_ENV === 'development' ? 'css/theme-colors.[contenthash:8].css' : 'web/css/theme-colors.[contenthash:8].css',
        matchColors: [
          ...forElementUI.getElementUISeries(process.env.VUE_APP_ELEMENT_COLOR) // Element-ui主色系列
        ],
        externalCssFiles: ['./node_modules/element-ui/lib/theme-chalk/index.css'], // optional, String or string array. Set external css files (such as cdn css) to extract colors.
        changeSelector: forElementUI.changeSelector,
        injectCss: true,
        isJsUgly: process.env.NODE_ENV === 'production' ? true : undefined
      }])
    config
      // 开发环境 sourcemap 不包含列信息
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )
      
    // markdown
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('text-loader')
      .loader('text-loader')
      .end()
    // svg
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .include
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'd2-[name]'
      })
      .end()
    // image exclude
    const imagesRule = config.module.rule('images')
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
    // 重新设置 alias
    config.resolve.alias
      .set('@api', resolve('src/api'))
    // 分析工具
    if (process.env.npm_config_report) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
  },
  // 不输出 map 文件
  productionSourceMap: false,
}
