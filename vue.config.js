require('./env.config.cjs')
'use strict'
const path = require('path')
// const webpack = require('webpack')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// 兄弟包的本地 ESM 入口指向 src/entrance/libTypes.ts，本包的 TS 规则只覆盖自己的 src；
// 精确匹配到它的 JS 代理入口，避免跨包 TS 源码进入本包编译（与 demo-vue2-ele 的 alias 同一思路）。
const jsProxyEntry = name => path.join(path.dirname(require.resolve(name + '/package.json')), 'hel_proxy/entry.js')

const name = defaultSettings.title || 'vue Admin Template' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 50010 npm run dev OR npm run dev --port = 50010
// 端口从本包 .env 注入，保证本包脱离 monorepo 也能独立启动（全局规则见根目录 ports.json，tpl = 500xx）
const port = process.env.port || process.env.npm_config_port || Number(process.env.DEV_PORT) // dev port


// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  // publicPath: '/',
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  transpileDependencies: ['@melt-js/libs-core'],
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // 开启跨域，方便本机上别的项目调试当前模块
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*'
    },
    before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    externals: { vue: 'Vue' },
    resolve: {
      alias: {
        '@': resolve('src'),
        '@melt-js/comps-vue2-ele$': jsProxyEntry('@melt-js/comps-vue2-ele'),
        '@melt-js/comps-vue2-ele-vea$': path.resolve(__dirname, 'vendor/vea-proxy/hel_proxy/entry.js')
      }
    }
  },
  chainWebpack(config) {
    // 生产构建统一去掉注释（含 /*! ... */ 版权 banner 与 @license）
    config.optimization.minimizer('terser').tap(args => {
      const terser = args[0]
      terser.terserOptions = {
        ...(terser.terserOptions || {}),
        output: { ...(terser.terserOptions?.output || {}), comments: false },
      }
      return args
    })
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // config.plugins.push(
    //   new webpack.optimize.LimitChunkCountPlugin({
    //     maxChunks: 2
    //   })
    // )

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
