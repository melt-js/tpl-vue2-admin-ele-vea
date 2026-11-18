// svgo 2.x 配置（等价于旧版 src/icons/svgo.yml 的 removeAttrs fill/fill-rule）
module.exports = {
  plugins: [
    {
      name: 'removeAttrs',
      params: { attrs: '(fill|fill-rule)' }
    }
  ]
}
