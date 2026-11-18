// 与 vue.config.js 的 publicPath 保持一致，支持静态子目录部署。
function localImage(file) {
  const base = process.env.NODE_ENV === 'production' ? './' : '/'
  return base + 'images/external/' + file
}

module.exports = { localImage }
